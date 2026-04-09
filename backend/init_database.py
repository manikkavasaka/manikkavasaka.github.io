"""
Database Initialization Script
Initializes both MongoDB and PostgreSQL with seed data
"""

from datetime import datetime, timedelta
import json
import sys

print("=" * 60)
print("🗄️  MK SHOPZONE - DATABASE INITIALIZATION")
print("=" * 60)

# ════════════════════════════════════════════════════════════════
# MONGODB INITIALIZATION
# ════════════════════════════════════════════════════════════════

def init_mongodb():
    """Initialize MongoDB with seed data"""
    print("\n📦 Initializing MongoDB...")

    try:
        from database_mongodb import DatabaseOps
        ops = DatabaseOps()

        print("✅ MongoDB connection established")

        # Create sample user
        user_id = ops.create_user(
            session_id="demo_session_001",
            ip_address="192.168.1.100",
            device="desktop",
            source="google"
        )
        print(f"✅ Sample user created: {user_id}")

        # Log sample behavior
        behavior_id = ops.log_behavior(
            session_id="demo_session_001",
            page_visited="/seo.html",
            time_spent=240,
            scroll_depth=85,
            clicks=["seo_button", "cta_button", "learn_more"]
        )
        print(f"✅ Sample behavior logged: {behavior_id}")

        # Create sample lead
        lead_id = ops.create_lead(
            name="John Smith",
            email="john.smith@example.com",
            phone="+1234567890",
            business="Tech Startup Inc",
            interest="SEO",
            session_id="demo_session_001",
            score=78
        )
        print(f"✅ Sample lead created: {lead_id}")

        # Save AI analysis
        analysis_id = ops.save_ai_analysis(
            session_id="demo_session_001",
            detected_intent="SEO",
            buying_stage="Consideration",
            recommended_service="Advanced SEO Package",
            generated_cta="Get Free SEO Audit",
            confidence_score=0.92
        )
        print(f"✅ AI analysis saved: {analysis_id}")

        # Create follow-up schedule
        followup_id = ops.create_followup_schedule(lead_id)
        print(f"✅ Follow-up schedule created: {followup_id}")

        # Create retargeting audience
        retargeting_id = ops.create_retargeting_audience(
            lead_id=lead_id,
            interest="SEO",
            audience_tag="high_intent",
            ad_platforms=["facebook", "google"]
        )
        print(f"✅ Retargeting audience created: {retargeting_id}")

        # Save daily summary
        summary_id = ops.save_daily_summary(
            date=datetime.utcnow().strftime("%Y-%m-%d"),
            metrics={
                "sessions": 150,
                "leads": 12,
                "conversion_rate": 8.0,
                "avg_engagement": 65.5,
                "leads_by_intent": {
                    "SEO": 5,
                    "Ads": 4,
                    "Web": 3
                },
                "leads_by_stage": {
                    "Awareness": 4,
                    "Consideration": 5,
                    "Decision": 3
                }
            }
        )
        print(f"✅ Daily summary saved: {summary_id}")

        print("\n✅ MongoDB initialization complete!")
        return True

    except Exception as e:
        print(f"❌ MongoDB initialization failed: {e}")
        return False


# ════════════════════════════════════════════════════════════════
# POSTGRESQL INITIALIZATION
# ════════════════════════════════════════════════════════════════

def init_postgresql():
    """Initialize PostgreSQL with tables and seed data"""
    print("\n📦 Initializing PostgreSQL...")

    try:
        from database_postgresql import init_database, DatabaseOps

        # Create tables
        init_database()
        print("✅ PostgreSQL tables created")

        with DatabaseOps() as ops:
            # Create sample user
            user = ops.create_user(
                session_id="demo_session_002",
                ip_address="192.168.1.101",
                device="mobile",
                source="facebook"
            )
            print(f"✅ Sample user created: {user.id}")

            # Log sample behavior
            behavior = ops.log_behavior(
                session_id="demo_session_002",
                page_visited="/ads.html",
                time_spent=180,
                scroll_depth=72,
                clicks=["ads_button", "pricing_link"]
            )
            print(f"✅ Sample behavior logged: {behavior.id}")

            # Create sample lead
            lead = ops.create_lead(
                name="Jane Doe",
                email="jane.doe@example.com",
                phone="+9876543210",
                business="E-commerce Store",
                interest="Paid Ads",
                score=85
            )
            print(f"✅ Sample lead created: {lead.id}")

            # Save AI analysis
            analysis = ops.save_ai_analysis(
                session_id="demo_session_002",
                detected_intent="Paid Ads",
                buying_stage="Decision",
                recommended_service="Premium PPC Package",
                generated_cta="Start Your Campaign Today",
                confidence_score=0.95
            )
            print(f"✅ AI analysis saved: {analysis.id}")

            # Create follow-up
            followup = ops.create_followup(lead.id)
            print(f"✅ Follow-up schedule created: {followup.id}")

            # Create retargeting
            retargeting = ops.create_retargeting_audience(
                lead_id=lead.id,
                interest="Paid Ads",
                audience_tag="warm_lead",
                ad_platforms=["google", "instagram"]
            )
            print(f"✅ Retargeting audience created: {retargeting.id}")

            # Save daily summary
            summary = ops.save_daily_summary(
                date=datetime.utcnow().strftime("%Y-%m-%d"),
                metrics={
                    "sessions": 200,
                    "leads": 18,
                    "converted": 3,
                    "conversion_rate": 9.0,
                    "avg_engagement": 68.5,
                    "leads_by_intent": {
                        "SEO": 7,
                        "Ads": 6,
                        "Web": 5
                    },
                    "leads_by_stage": {
                        "Awareness": 6,
                        "Consideration": 7,
                        "Decision": 5
                    }
                }
            )
            print(f"✅ Daily summary saved: {summary.id}")

        print("\n✅ PostgreSQL initialization complete!")
        return True

    except Exception as e:
        print(f"❌ PostgreSQL initialization failed: {e}")
        return False


# ════════════════════════════════════════════════════════════════
# MAIN EXECUTION
# ════════════════════════════════════════════════════════════════

def main():
    """Run initialization"""

    import os
    from dotenv import load_dotenv

    load_dotenv()

    print("\n📋 Configuration:")
    print(f"   MongoDB URL: {os.getenv('MONGODB_URL', 'mongodb://localhost:27017')}")
    print(f"   PostgreSQL: {os.getenv('DATABASE_URL', 'postgresql://localhost/mkshopzone')}")

    # Ask which database to initialize
    print("\n🔍 Select database to initialize:")
    print("   1. MongoDB (recommended)")
    print("   2. PostgreSQL (alternative)")
    print("   3. Both")
    print("   0. Cancel")

    choice = input("\nEnter choice (0-3): ").strip()

    results = []

    if choice in ["1", "3"]:
        results.append(("MongoDB", init_mongodb()))

    if choice in ["2", "3"]:
        results.append(("PostgreSQL", init_postgresql()))

    if choice == "0":
        print("\n❌ Cancelled")
        return

    # Summary
    print("\n" + "=" * 60)
    print("📊 INITIALIZATION SUMMARY")
    print("=" * 60)

    for db_name, success in results:
        status = "✅ SUCCESS" if success else "❌ FAILED"
        print(f"{db_name}: {status}")

    print("\n" + "=" * 60)
    print("🎉 Database initialization complete!")
    print("=" * 60)

    print("\n📝 Next steps:")
    print("   1. Update .env with your API keys")
    print("   2. Start backend: python run.py")
    print("   3. Access dashboard: http://localhost:8000/dashboard.html")
    print("   4. Monitor lead capture and conversions")

    print("\n✅ Your AI-powered database is ready!")


if __name__ == "__main__":
    main()

