"""
MongoDB index creation and TTL policy setup.
Run once on app startup to ensure optimal query performance.
"""

import asyncio
import logging
from db_manager import get_db, connect_db, close_db

logger = logging.getLogger(__name__)


async def create_all_indexes():
    """Create all necessary database indexes and TTL policies."""
    
    try:
        db = await get_db()
        if db is None:
            logger.warning("Database not connected. Skipping index creation.")
            return
        
        logger.info("Creating database indexes...")
        
        # SESSIONS Collection
        # Index for session ID lookup (unique)
        await db["sessions"].create_index("sessionId", unique=True)
        logger.info("Created unique index on sessions.sessionId")
        
        # TTL Index: Auto-delete sessions after 30 days
        await db["sessions"].create_index(
            "createdAt",
            expireAfterSeconds=2592000  # 30 days
        )
        logger.info("Created TTL index on sessions.createdAt (30 days)")
        
        # LEADS Collection
        # Index for email lookup (unique)
        await db["leads"].create_index("email", unique=True, sparse=True)
        logger.info("Created unique index on leads.email")
        
        # Index for phone lookup
        await db["leads"].create_index("phone", sparse=True)
        logger.info("Created index on leads.phone")
        
        # Index for status filtering
        await db["leads"].create_index("status")
        logger.info("Created index on leads.status")
        
        # Index for intent filtering
        await db["leads"].create_index("intent")
        logger.info("Created index on leads.intent")
        
        # Compound index for common filter combinations
        await db["leads"].create_index([("status", 1), ("intent", 1)])
        logger.info("Created compound index on leads(status, intent)")
        
        # Index for created time (for sorting)
        await db["leads"].create_index("createdAt", direction=-1)
        logger.info("Created descending index on leads.createdAt")
        
        # TTL Index: Auto-delete old leads after 90 days
        await db["leads"].create_index(
            "createdAt",
            expireAfterSeconds=7776000  # 90 days
        )
        logger.info("Created TTL index on leads.createdAt (90 days)")
        
        # COMMUNICATION_LOGS Collection
        # Index for lead lookup
        await db["communication_logs"].create_index("leadId")
        logger.info("Created index on communication_logs.leadId")
        
        # Index for timestamp (for sorting)
        await db["communication_logs"].create_index("timestamp")
        logger.info("Created index on communication_logs.timestamp")
        
        # Compound index for lead + timestamp queries
        await db["communication_logs"].create_index([
            ("leadId", 1),
            ("timestamp", -1)
        ])
        logger.info("Created compound index on communication_logs(leadId, timestamp)")
        
        # TTL Index: Auto-delete old communication logs after 180 days
        await db["communication_logs"].create_index(
            "timestamp",
            expireAfterSeconds=15552000  # 180 days
        )
        logger.info("Created TTL index on communication_logs.timestamp (180 days)")
        
        logger.info("All database indexes created successfully!")
        
    except Exception as e:
        logger.error(f"Failed to create database indexes: {str(e)}", exc_info=True)
        raise


async def verify_indexes():
    """Verify all indexes were created successfully."""
    
    try:
        db = await get_db()
        if db is None:
            logger.warning("Database not connected. Skipping index verification.")
            return
        
        logger.info("Verifying database indexes...")
        
        collections = {
            "sessions": ["sessionId", "createdAt"],
            "leads": ["email", "phone", "status", "intent", "createdAt"],
            "communication_logs": ["leadId", "timestamp"],
        }
        
        for collection_name, expected_fields in collections.items():
            indexes = await db[collection_name].list_indexes().to_list(None)
            index_names = [idx["key"] for idx in indexes]
            
            logger.info(f"Collection '{collection_name}' indexes:")
            for idx in indexes:
                logger.info(f"  - {idx['name']}: {idx['key']}")
        
        logger.info("Index verification completed!")
        
    except Exception as e:
        logger.error(f"Failed to verify indexes: {str(e)}", exc_info=True)
        raise


async def main():
    """Main entry point - create and verify indexes."""
    
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    )
    
    logger.info("Connecting to database...")
    await connect_db()
    
    try:
        await create_all_indexes()
        await verify_indexes()
        logger.info("Database optimization completed successfully!")
    finally:
        await close_db()


if __name__ == "__main__":
    asyncio.run(main())
