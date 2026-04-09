"""
MongoDB Database Configuration & Schema Setup
MK Shopzone - AI-Powered Digital Marketing Platform

This file contains:
1. MongoDB connection setup
2. Collection schemas
3. Indexes for optimization
4. CRUD operations
5. Aggregation pipelines
"""

from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import os
from dotenv import load_dotenv

load_dotenv()

class MongoDBConnection:
    """Singleton MongoDB connection handler"""

    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if self._initialized:
            return

        try:
            # Connection string
            mongo_url = os.getenv(
                "MONGODB_URL",
                "mongodb://localhost:27017/mkshopzone"
            )

            # Connect
            self.client = MongoClient(mongo_url, serverSelectionTimeoutMS=5000)
            self.client.admin.command('ismaster')  # Test connection

            self.db = self.client["mkshopzone"]
            self._initialized = True

            print("✅ MongoDB Connected Successfully")

            # Initialize collections
            self._init_collections()

        except ServerSelectionTimeoutError:
            print("❌ MongoDB connection failed")
            raise

    def _init_collections(self):
        """Initialize collections and indexes"""

        # ════════════════════════════════════════════════════════════
        # 1. USERS COLLECTION
        # ════════════════════════════════════════════════════════════
        if "users" not in self.db.list_collection_names():
            self.db.create_collection("users")

        users = self.db["users"]
        users.create_index("session_id", unique=True)
        users.create_index("ip_address")
        users.create_index("created_at")

        print("✅ Users collection initialized")

        # ════════════════════════════════════════════════════════════
        # 2. USER_BEHAVIOR COLLECTION
        # ════════════════════════════════════════════════════════════
        if "user_behavior" not in self.db.list_collection_names():
            self.db.create_collection("user_behavior")

        behavior = self.db["user_behavior"]
        behavior.create_index("session_id")
        behavior.create_index("timestamp")
        behavior.create_index([("session_id", 1), ("timestamp", -1)])

        print("✅ User behavior collection initialized")

        # ════════════════════════════════════════════════════════════
        # 3. LEADS COLLECTION
        # ════════════════════════════════════════════════════════════
        if "leads" not in self.db.list_collection_names():
            self.db.create_collection("leads")

        leads = self.db["leads"]
        leads.create_index("email", unique=True)
        leads.create_index("phone")
        leads.create_index("interest")
        leads.create_index("status")
        leads.create_index("created_at")
        leads.create_index("score", direction=-1)

        print("✅ Leads collection initialized")

        # ════════════════════════════════════════════════════════════
        # 4. AI_ANALYTICS COLLECTION
        # ════════════════════════════════════════════════════════════
        if "ai_analytics" not in self.db.list_collection_names():
            self.db.create_collection("ai_analytics")

        analytics = self.db["ai_analytics"]
        analytics.create_index("session_id")
        analytics.create_index("detected_intent")
        analytics.create_index("buying_stage")
        analytics.create_index("timestamp")

        print("✅ AI analytics collection initialized")

        # ════════════════════════════════════════════════════════════
        # 5. FOLLOWUPS COLLECTION
        # ════════════════════════════════════════════════════════════
        if "followups" not in self.db.list_collection_names():
            self.db.create_collection("followups")

        followups = self.db["followups"]
        followups.create_index("lead_id")
        followups.create_index("status")
        followups.create_index("next_followup")
        followups.create_index("last_followup")

        print("✅ Followups collection initialized")

        # ════════════════════════════════════════════════════════════
        # 6. RETARGETING COLLECTION
        # ════════════════════════════════════════════════════════════
        if "retargeting" not in self.db.list_collection_names():
            self.db.create_collection("retargeting")

        retargeting = self.db["retargeting"]
        retargeting.create_index("lead_id")
        retargeting.create_index("interest")
        retargeting.create_index("audience_tag")
        retargeting.create_index("created_at")

        print("✅ Retargeting collection initialized")

        # ════════════════════════════════════════════════════════════
        # 7. CAMPAIGNS COLLECTION
        # ════════════════════════════════════════════════════════════
        if "campaigns" not in self.db.list_collection_names():
            self.db.create_collection("campaigns")

        campaigns = self.db["campaigns"]
        campaigns.create_index("campaign_id", unique=True)
        campaigns.create_index("status")
        campaigns.create_index("created_at")

        print("✅ Campaigns collection initialized")

        # ════════════════════════════════════════════════════════════
        # 8. ANALYTICS_SUMMARY COLLECTION
        # ════════════════════════════════════════════════════════════
        if "analytics_summary" not in self.db.list_collection_names():
            self.db.create_collection("analytics_summary")

        summary = self.db["analytics_summary"]
        summary.create_index("date")
        summary.create_index("metric_type")

        print("✅ Analytics summary collection initialized")

    @property
    def collections(self):
        """Return all collections"""
        return {
            "users": self.db["users"],
            "behavior": self.db["user_behavior"],
            "leads": self.db["leads"],
            "analytics": self.db["ai_analytics"],
            "followups": self.db["followups"],
            "retargeting": self.db["retargeting"],
            "campaigns": self.db["campaigns"],
            "summary": self.db["analytics_summary"]
        }

    def close(self):
        """Close connection"""
        if self.client:
            self.client.close()


# ════════════════════════════════════════════════════════════════
# DATABASE OPERATIONS
# ════════════════════════════════════════════════════════════════

class DatabaseOps:
    """CRUD operations for all collections"""

    def __init__(self):
        self.db = MongoDBConnection()
        self.collections = self.db.collections

    # ────────────────────────────────────────────────────────────
    # USERS OPERATIONS
    # ────────────────────────────────────────────────────────────

    def create_user(self, session_id: str, ip_address: str,
                   device: str, source: str) -> str:
        """Create new user session"""

        user = {
            "session_id": session_id,
            "ip_address": ip_address,
            "device": device,  # mobile, desktop, tablet
            "source": source,  # google, facebook, direct, email
            "created_at": datetime.utcnow(),
            "last_activity": datetime.utcnow(),
            "pages_visited": [],
            "total_events": 0,
            "status": "active"
        }

        result = self.collections["users"].insert_one(user)
        return str(result.inserted_id)

    def update_user_activity(self, session_id: str):
        """Update user last activity"""

        self.collections["users"].update_one(
            {"session_id": session_id},
            {
                "$set": {"last_activity": datetime.utcnow()},
                "$inc": {"total_events": 1}
            }
        )

    # ────────────────────────────────────────────────────────────
    # USER BEHAVIOR OPERATIONS
    # ────────────────────────────────────────────────────────────

    def log_behavior(self, session_id: str, page_visited: str,
                    time_spent: int, scroll_depth: float,
                    clicks: List[str] = None) -> str:
        """Log user behavior"""

        behavior = {
            "session_id": session_id,
            "page_visited": page_visited,
            "time_spent": time_spent,
            "scroll_depth": scroll_depth,
            "clicks": clicks or [],
            "timestamp": datetime.utcnow(),
            "engagement_score": self._calculate_engagement(
                time_spent, scroll_depth, len(clicks or [])
            )
        }

        result = self.collections["behavior"].insert_one(behavior)
        return str(result.inserted_id)

    def get_session_behavior(self, session_id: str) -> List[Dict]:
        """Get all behavior for a session"""

        return list(self.collections["behavior"].find(
            {"session_id": session_id}
        ).sort("timestamp", -1))

    @staticmethod
    def _calculate_engagement(time_spent: int, scroll_depth: float,
                             clicks_count: int) -> float:
        """Calculate engagement score"""

        score = 0

        # Time scoring
        if time_spent >= 300:
            score += 25
        elif time_spent >= 120:
            score += 15
        elif time_spent >= 60:
            score += 10

        # Scroll depth scoring
        if scroll_depth >= 75:
            score += 25
        elif scroll_depth >= 50:
            score += 15
        elif scroll_depth >= 25:
            score += 10

        # Clicks scoring
        if clicks_count >= 5:
            score += 20
        elif clicks_count >= 3:
            score += 10
        elif clicks_count >= 1:
            score += 5

        return min(score, 100)

    # ────────────────────────────────────────────────────────────
    # LEADS OPERATIONS
    # ────────────────────────────────────────────────────────────

    def create_lead(self, name: str, email: str, phone: str,
                   business: str, interest: str, session_id: str,
                   score: int = 50) -> str:
        """Create new lead"""

        lead = {
            "name": name,
            "email": email,
            "phone": phone,
            "business": business,
            "interest": interest,  # SEO, Ads, Web, Social, App, General
            "session_id": session_id,
            "score": score,
            "source": "website",
            "created_at": datetime.utcnow(),
            "status": "new",  # new, contacted, qualified, converted, lost
            "last_contact": None,
            "contact_count": 0,
            "whatsapp_sent": False,
            "email_sent": False,
            "notes": ""
        }

        result = self.collections["leads"].insert_one(lead)
        return str(result.inserted_id)

    def get_lead(self, lead_id: str) -> Optional[Dict]:
        """Get lead by ID"""

        from bson import ObjectId

        return self.collections["leads"].find_one(
            {"_id": ObjectId(lead_id)}
        )

    def get_leads_by_status(self, status: str, limit: int = 50) -> List[Dict]:
        """Get leads by status"""

        return list(self.collections["leads"].find(
            {"status": status}
        ).sort("created_at", -1).limit(limit))

    def update_lead_status(self, lead_id: str, status: str, notes: str = ""):
        """Update lead status"""

        from bson import ObjectId

        self.collections["leads"].update_one(
            {"_id": ObjectId(lead_id)},
            {
                "$set": {
                    "status": status,
                    "last_contact": datetime.utcnow(),
                    "notes": notes
                },
                "$inc": {"contact_count": 1}
            }
        )

    def update_lead_communication(self, lead_id: str, whatsapp: bool = False,
                                  email: bool = False):
        """Update communication status"""

        from bson import ObjectId

        update_dict = {}
        if whatsapp:
            update_dict["whatsapp_sent"] = True
        if email:
            update_dict["email_sent"] = True

        if update_dict:
            self.collections["leads"].update_one(
                {"_id": ObjectId(lead_id)},
                {"$set": update_dict}
            )

    # ────────────────────────────────────────────────────────────
    # AI ANALYTICS OPERATIONS
    # ────────────────────────────────────────────────────────────

    def save_ai_analysis(self, session_id: str, detected_intent: str,
                        buying_stage: str, recommended_service: str,
                        generated_cta: str, confidence_score: float) -> str:
        """Save AI analysis results"""

        analysis = {
            "session_id": session_id,
            "detected_intent": detected_intent,
            "buying_stage": buying_stage,
            "recommended_service": recommended_service,
            "generated_cta": generated_cta,
            "confidence_score": confidence_score,
            "timestamp": datetime.utcnow()
        }

        result = self.collections["analytics"].insert_one(analysis)
        return str(result.inserted_id)

    def get_analytics_for_session(self, session_id: str) -> Optional[Dict]:
        """Get AI analytics for session"""

        return self.collections["analytics"].find_one(
            {"session_id": session_id},
            sort=[("timestamp", -1)]
        )

    # ────────────────────────────────────────────────────────────
    # FOLLOWUPS OPERATIONS
    # ────────────────────────────────────────────────────────────

    def create_followup_schedule(self, lead_id: str) -> str:
        """Create follow-up schedule for lead"""

        from bson import ObjectId

        followup = {
            "lead_id": ObjectId(lead_id),
            "whatsapp_sent": False,
            "email_sent": False,
            "last_followup": None,
            "next_followup": datetime.utcnow() + timedelta(hours=1),
            "status": "active",
            "followup_count": 0,
            "created_at": datetime.utcnow()
        }

        result = self.collections["followups"].insert_one(followup)
        return str(result.inserted_id)

    def get_pending_followups(self) -> List[Dict]:
        """Get all pending follow-ups"""

        return list(self.collections["followups"].find({
            "status": "active",
            "next_followup": {"$lte": datetime.utcnow()}
        }))

    def mark_followup_sent(self, followup_id: str, channel: str):
        """Mark follow-up as sent"""

        from bson import ObjectId

        update = {
            "last_followup": datetime.utcnow(),
            "next_followup": datetime.utcnow() + timedelta(days=1)
        }

        if channel == "whatsapp":
            update["whatsapp_sent"] = True
        elif channel == "email":
            update["email_sent"] = True

        self.collections["followups"].update_one(
            {"_id": ObjectId(followup_id)},
            {
                "$set": update,
                "$inc": {"followup_count": 1}
            }
        )

    # ────────────────────────────────────────────────────────────
    # RETARGETING OPERATIONS
    # ────────────────────────────────────────────────────────────

    def create_retargeting_audience(self, lead_id: str, interest: str,
                                   audience_tag: str,
                                   ad_platforms: List[str]) -> str:
        """Create retargeting audience segment"""

        from bson import ObjectId

        retargeting = {
            "lead_id": ObjectId(lead_id),
            "interest": interest,
            "audience_tag": audience_tag,  # high_intent, warm_lead, cold_lead
            "ad_platform": ad_platforms,  # facebook, google, instagram
            "created_at": datetime.utcnow(),
            "status": "active",
            "impressions": 0,
            "clicks": 0,
            "conversions": 0
        }

        result = self.collections["retargeting"].insert_one(retargeting)
        return str(result.inserted_id)

    def get_retargeting_audiences(self, interest: str = None) -> List[Dict]:
        """Get retargeting audiences"""

        query = {"status": "active"}
        if interest:
            query["interest"] = interest

        return list(self.collections["retargeting"].find(query))

    # ────────────────────────────────────────────────────────────
    # ANALYTICS SUMMARY OPERATIONS
    # ────────────────────────────────────────────────────────────

    def save_daily_summary(self, date: str, metrics: Dict) -> str:
        """Save daily analytics summary"""

        summary = {
            "date": date,
            "metric_type": "daily",
            "total_sessions": metrics.get("sessions", 0),
            "total_leads": metrics.get("leads", 0),
            "conversion_rate": metrics.get("conversion_rate", 0),
            "avg_engagement": metrics.get("avg_engagement", 0),
            "leads_by_intent": metrics.get("leads_by_intent", {}),
            "leads_by_stage": metrics.get("leads_by_stage", {}),
            "created_at": datetime.utcnow()
        }

        result = self.collections["summary"].insert_one(summary)
        return str(result.inserted_id)

    def get_analytics_summary(self, days: int = 30) -> List[Dict]:
        """Get analytics summary for last N days"""

        start_date = (datetime.utcnow() - timedelta(days=days)).isoformat()

        return list(self.collections["summary"].find({
            "date": {"$gte": start_date}
        }).sort("date", -1))


# ════════════════════════════════════════════════════════════════
# AGGREGATION PIPELINES
# ════════════════════════════════════════════════════════════════

class DatabaseAggregations:
    """Complex aggregation queries"""

    def __init__(self):
        self.db = MongoDBConnection()
        self.collections = self.db.collections

    def get_conversion_funnel(self) -> Dict:
        """Get conversion funnel analytics"""

        pipeline = [
            {
                "$group": {
                    "_id": "$buying_stage",
                    "count": {"$sum": 1}
                }
            },
            {"$sort": {"_id": 1}}
        ]

        return list(self.collections["analytics"].aggregate(pipeline))

    def get_top_interests(self, limit: int = 10) -> List[Dict]:
        """Get top service interests"""

        pipeline = [
            {
                "$group": {
                    "_id": "$interest",
                    "count": {"$sum": 1},
                    "avg_score": {"$avg": "$score"}
                }
            },
            {"$sort": {"count": -1}},
            {"$limit": limit}
        ]

        return list(self.collections["leads"].aggregate(pipeline))

    def get_user_engagement_stats(self) -> Dict:
        """Get overall engagement statistics"""

        pipeline = [
            {
                "$group": {
                    "_id": None,
                    "avg_time_spent": {"$avg": "$time_spent"},
                    "avg_scroll_depth": {"$avg": "$scroll_depth"},
                    "avg_clicks": {"$avg": {"$size": "$clicks"}},
                    "max_engagement": {"$max": "$engagement_score"}
                }
            }
        ]

        return list(self.collections["behavior"].aggregate(pipeline))

    def get_lead_source_breakdown(self) -> List[Dict]:
        """Get leads by source"""

        pipeline = [
            {
                "$group": {
                    "_id": "$source",
                    "total_leads": {"$sum": 1},
                    "converted": {
                        "$sum": {"$cond": [{"$eq": ["$status", "converted"]}, 1, 0]}
                    }
                }
            }
        ]

        return list(self.collections["leads"].aggregate(pipeline))


# ════════════════════════════════════════════════════════════════
# INITIALIZATION
# ════════════════════════════════════════════════════════════════

def init_database():
    """Initialize database connection"""
    try:
        db = MongoDBConnection()
        return db
    except Exception as e:
        print(f"❌ Database initialization failed: {e}")
        raise


if __name__ == "__main__":
    # Test connection
    db = init_database()
    ops = DatabaseOps()

    print("\n✅ Database setup complete!")
    print("Collections available:")
    for collection in ops.collections:
        print(f"  - {collection}")

