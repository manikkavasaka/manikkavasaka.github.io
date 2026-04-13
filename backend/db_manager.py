"""
database.py — Async MongoDB connection manager with in-memory fallback.
Used by main.py for all persistent storage operations.
"""

import os

from datetime import datetime
from typing import Optional, List, Dict, Any
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "")
DB_NAME   = os.getenv("MONGO_DB", "mkshopzone_ai")

# ── Try to import Motor (async MongoDB driver) ────────────────────────────────
try:
    from motor.motor_asyncio import AsyncIOMotorClient
    _MOTOR_AVAILABLE = True
except ImportError:
    _MOTOR_AVAILABLE = False

_client: Optional[Any] = None
_db: Optional[Any]     = None

# ── In-memory fallback stores ─────────────────────────────────────────────────
_mem_sessions: Dict[str, Any] = {}
_mem_leads:    List[Any]      = []
_mem_followups: List[Any]     = []


async def log_communication(lead_id: str, channel: str, status: str, details: str):
    """Logs an automated communication attempt (WhatsApp/SMS/Email)"""
    log_data = {
        "leadId": lead_id,
        "channel": channel,
        "status": status,
        "details": details,
        "timestamp": datetime.utcnow()
    }
    if _use_mongo() and _db is not None:
        await _db["communication_logs"].insert_one(log_data)
    else:
        _mem_followups.append(log_data)
    print(f"[LOG] {channel.upper()} for Lead {lead_id}: {status}")



def _use_mongo() -> bool:

    return _MOTOR_AVAILABLE and bool(MONGO_URI)

async def get_db():
    return _db



async def connect_db():
    """Call on FastAPI startup."""
    global _client, _db

    if _use_mongo():
        _client = AsyncIOMotorClient(MONGO_URI)
        _db = _client[DB_NAME]
        print("✅ MongoDB connected:", DB_NAME)
    else:
        print("⚠️  MongoDB not configured — using in-memory store (dev mode).")


async def close_db():
    """Call on FastAPI shutdown."""
    if _client:
        _client.close()


# ── Session helpers ───────────────────────────────────────────────────────────

async def save_session(session_id: str, data: dict):
    if _use_mongo():
        await _db["sessions"].update_one(
            {"sessionId": session_id},
            {"$set": {**data, "updatedAt": datetime.utcnow()}},
            upsert=True
        )
    else:
        _mem_sessions[session_id] = {**data, "updatedAt": datetime.utcnow()}


async def get_session(session_id: str) -> Optional[dict]:
    if _use_mongo():
        doc = await _db["sessions"].find_one({"sessionId": session_id})
        return doc
    return _mem_sessions.get(session_id)


async def get_all_sessions() -> List[dict]:
    if _use_mongo():
        cursor = _db["sessions"].find({}).limit(500)
        return await cursor.to_list(length=500)
    return list(_mem_sessions.values())


# ── Lead helpers ──────────────────────────────────────────────────────────────

async def save_lead(lead_data: dict) -> str:
    if _use_mongo():
        result = await _db["leads"].insert_one({
            **lead_data,
            "createdAt": datetime.utcnow()
        })
        return str(result.inserted_id)
    else:
        lead_data["_id"] = len(_mem_leads)
        _mem_leads.append(lead_data)
        return str(lead_data["_id"])


async def get_lead(lead_id: Any) -> Optional[dict]:
    if _use_mongo():
        from bson import ObjectId
        try:
            doc = await _db["leads"].find_one({"_id": ObjectId(lead_id)})
            if doc:
                doc["_id"] = str(doc["_id"])
            return doc
        except Exception:
            return None
    try:
        return _mem_leads[int(lead_id)]
    except (IndexError, ValueError):
        return None


async def get_all_leads(
    skip: int = 0,
    limit: int = 50,
    status: Optional[str] = None,
    intent: Optional[str] = None
) -> tuple[List[dict], int]:
    """Returns (leads, total_count)"""
    if _use_mongo():
        query: Dict[str, Any] = {}
        if status:
            query["status"] = status
        if intent:
            query["intent"] = intent
        total  = await _db["leads"].count_documents(query)
        cursor = _db["leads"].find(query).skip(skip).limit(limit).sort("createdAt", -1)
        docs   = await cursor.to_list(length=limit)
        for d in docs:
            d["_id"] = str(d["_id"])
        return docs, total
    filtered = _mem_leads
    if status:
        filtered = [l for l in filtered if l.get("status") == status]
    if intent:
        filtered = [l for l in filtered if l.get("intent") == intent]
    return filtered[skip: skip + limit], len(filtered)


async def update_lead_status(lead_id: Any, status: str, notes: str = ""):
    if _use_mongo():
        from bson import ObjectId
        await _db["leads"].update_one(
            {"_id": ObjectId(lead_id)},
            {"$set": {"status": status, "notes": notes, "updatedAt": datetime.utcnow()}}
        )
    else:
        try:
            _mem_leads[int(lead_id)]["status"] = status
        except Exception:
            pass


async def get_lead_count() -> int:
    if _use_mongo():
        return await _db["leads"].count_documents({})
    return len(_mem_leads)


# ── Dashboard analytics helpers ───────────────────────────────────────────────

async def get_dashboard_metrics() -> dict:
    if _use_mongo():
        pipeline_stage = [
            {"$group": {"_id": "$buyingStage", "count": {"$sum": 1}}}
        ]
        pipeline_intent = [
            {"$group": {"_id": "$intent", "count": {"$sum": 1}}}
        ]
        pipeline_status = [
            {"$group": {"_id": "$status", "count": {"$sum": 1}}}
        ]
        pipeline_score = [
            {"$group": {"_id": None, "avgScore": {"$avg": "$score"}}}
        ]

        stage_result  = await _db["leads"].aggregate(pipeline_stage).to_list(20)
        intent_result = await _db["leads"].aggregate(pipeline_intent).to_list(20)
        status_result = await _db["leads"].aggregate(pipeline_status).to_list(20)
        score_result  = await _db["leads"].aggregate(pipeline_score).to_list(1)

        total_sessions = await get_all_sessions()
        total_leads    = await get_lead_count()

        return {
            "total_sessions": len(total_sessions),
            "total_leads":    total_leads,
            "conversion_rate": f"{(total_leads / max(len(total_sessions), 1) * 100):.2f}%",
            "avg_score":      round(score_result[0]["avgScore"] if score_result else 0, 1),
            "by_stage":  {r["_id"]: r["count"] for r in stage_result},
            "by_intent": {r["_id"]: r["count"] for r in intent_result},
            "by_status": {r["_id"]: r["count"] for r in status_result},
        }
    else:
        leads = _mem_leads
        total_leads = len(leads)
        total_sessions = len(_mem_sessions)
        avg_score = round(sum(l.get("score", 0) for l in leads) / max(total_leads, 1), 1)

        by_stage  = {}
        by_intent = {}
        by_status = {}
        for l in leads:
            s = l.get("buyingStage", "awareness")
            i = l.get("intent", "general")
            st = l.get("status", "new")
            by_stage[s]   = by_stage.get(s, 0) + 1
            by_intent[i]  = by_intent.get(i, 0) + 1
            by_status[st] = by_status.get(st, 0) + 1

        return {
            "total_sessions":  total_sessions,
            "total_leads":     total_leads,
            "conversion_rate": f"{(total_leads / max(total_sessions, 1) * 100):.2f}%",
            "avg_score":       avg_score,
            "by_stage":        by_stage,
            "by_intent":       by_intent,
            "by_status":       by_status,
        }
