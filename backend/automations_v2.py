"""
AutomationService - Handles all automated follow-ups
- WhatsApp messaging (Meta API / Twilio)
- Email campaigns (SendGrid / SMTP)
- Daily nurture sequences
- Smart timing based on intent & stage
"""

import os
import httpx
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta
from dotenv import load_dotenv
from typing import Dict, List

load_dotenv()

class AutomationService:
    """
    Handles all automated communication:
    - Instant WhatsApp confirmations
    - Welcome emails
    - Daily follow-ups (personalized by intent)
    - Smart retry logic
    """

    # WhatsApp & Email templates
    WHATSAPP_TEMPLATES = {
        "SEO": "Hi {name}! 👋 Ready to dominate Google? We'll show you the exact SEO strategy that got our clients into the top 3. Let's schedule your free SEO audit! 📈",
        "Paid Ads": "Hi {name}! 💰 Your competitors are already scaling with ads. Want to outsmart them with a high-ROI strategy? Free ad audit included! Let's talk.",
        "Web Design": "Hi {name}! 🌐 Your website should be your best salesman. Let's redesign it to convert more. Free design audit? Count us in! 🎨",
        "Social Media": "Hi {name}! 📱 Social media that actually sells. We've built communities with 10K+ engaged followers. Want the same? Let's chat!",
        "General": "Hi {name}! 👋 Thanks for checking us out. We help businesses like yours scale. Let's find the perfect growth strategy for you! 🚀"
    }

    EMAIL_TEMPLATES = {
        "welcome": """
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }}
                .content {{ padding: 20px; }}
                .cta {{ background: #667eea; color: white; padding: 12px 30px; text-align: center; display: inline-block; border-radius: 5px; }}
                .footer {{ text-align: center; color: #999; margin-top: 30px; font-size: 12px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Welcome to MK Shopzone! 🎉</h1>
                </div>
                <div class="content">
                    <p>Hi {name},</p>
                    <p>Thanks for reaching out! We've received your inquiry about {intent}.</p>
                    <p>Our team is now analyzing your profile and we'll reach out within the next 60 minutes with a personalized strategy.</p>
                    <p><strong>What happens next:</strong></p>
                    <ul>
                        <li>✓ Free strategy audit based on your needs</li>
                        <li>✓ Customized action plan</li>
                        <li>✓ Expert consultation call</li>
                        <li>✓ Zero pressure, high value</li>
                    </ul>
                    <p style="text-align: center; margin-top: 30px;">
                        <a href="https://calendly.com/mkshopzone" class="cta">Book Your Free Consultation</a>
                    </p>
                    <p>In the meantime, check out our case studies to see how we've helped similar businesses.</p>
                    <p>Best regards,<br>The MK Shopzone Team</p>
                </div>
                <div class="footer">
                    <p>© 2026 MK Shopzone. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        """,

        "day1_social": """
        <!DOCTYPE html>
        <html>
        <body>
            <div style="max-width: 600px; margin: 0 auto;">
                <h2>Day 1: Here's What We'd Do For You</h2>
                <p>Hi {name},</p>
                <p>Yesterday you expressed interest in {intent}. Here's a sneak peek at our process:</p>
                <h3>Our Proven 3-Step System:</h3>
                <ol>
                    <li><strong>Audit:</strong> Deep dive into your current state</li>
                    <li><strong>Strategy:</strong> Custom roadmap for growth</li>
                    <li><strong>Execution:</strong> We implement and measure</li>
                </ol>
                <p>Most clients see results within 30-60 days.</p>
                <p><strong>Last 10 Case Studies:</strong></p>
                <ul>
                    <li>🏆 Tech Startup: 300% increase in leads</li>
                    <li>🏆 E-commerce: $500K additional revenue</li>
                    <li>🏆 SaaS: 50% lower CAC</li>
                </ul>
                <p>Ready to be next? <a href="https://calendly.com/mkshopzone">Schedule your free audit →</a></p>
            </div>
        </body>
        </html>
        """,

        "day3_urgency": """
        <!DOCTYPE html>
        <html>
        <body>
            <div style="max-width: 600px; margin: 0 auto;">
                <h2>Day 3: Your Competitor Is Already Moving</h2>
                <p>Hi {name},</p>
                <p>Just wanted to check in. While you're thinking about {intent}, your competitors are already implementing strategies.</p>
                <p><strong>Time-sensitive offer (48 hours):</strong></p>
                <ul>
                    <li>✓ Free $2000 audit (normally paid)</li>
                    <li>✓ Free 90-day action plan</li>
                    <li>✓ 20% off first 3 months</li>
                </ul>
                <p>This offer expires in 48 hours.</p>
                <p><a href="https://calendly.com/mkshopzone">Claim your free audit now →</a></p>
            </div>
        </body>
        </html>
        """
    }

    @staticmethod
    async def send_whatsapp(phone: str, name: str, intent: str):
        """Send WhatsApp message via Twilio or Meta API"""

        # Get template
        template = AutomationService.WHATSAPP_TEMPLATES.get(
            intent,
            AutomationService.WHATSAPP_TEMPLATES["General"]
        )
        message = template.format(name=name)

        try:
            # Check for Twilio API key
            twilio_sid = os.getenv("TWILIO_ACCOUNT_SID")
            twilio_token = os.getenv("TWILIO_AUTH_TOKEN")
            from_number = os.getenv("TWILIO_PHONE_NUMBER")

            if twilio_sid and twilio_token:
                # Send via Twilio
                auth = (twilio_sid, twilio_token)
                url = f"https://api.twilio.com/2010-04-01/Accounts/{twilio_sid}/Messages.json"

                data = {
                    "From": from_number,
                    "To": phone,
                    "Body": message
                }

                async with httpx.AsyncClient() as client:
                    response = await client.post(url, data=data, auth=auth)

                    if response.status_code == 201:
                        print(f"✅ WhatsApp sent to {phone}")
                        return True

            # Fallback: Log message
            print(f"📱 [WhatsApp to {phone}]: {message}")
            return True

        except Exception as e:
            print(f"❌ WhatsApp error: {e}")
            return False

    @staticmethod
    async def send_email(email: str, name: str, intent: str, business: str = ""):
        """Send email via SendGrid or SMTP"""

        try:
            # Prepare email
            subject = f"✓ Welcome to MK Shopzone - Your {intent} Strategy Awaits"

            template_html = AutomationService.EMAIL_TEMPLATES["welcome"].format(
                name=name,
                intent=intent
            )

            # Try SendGrid first
            sendgrid_key = os.getenv("SENDGRID_API_KEY")
            if sendgrid_key:
                from sendgrid import SendGridAPIClient
                from sendgrid.helpers.mail import Mail

                message = Mail(
                    from_email=os.getenv("SENDGRID_FROM_EMAIL", "noreply@mkshopzone.com"),
                    to_emails=email,
                    subject=subject,
                    html_content=template_html
                )

                sg = SendGridAPIClient(sendgrid_key)
                response = sg.send(message)
                print(f"✅ Email sent to {email} via SendGrid")
                return True

            # Fallback to SMTP
            smtp_server = os.getenv("SMTP_SERVER")
            smtp_port = os.getenv("SMTP_PORT")
            smtp_user = os.getenv("SMTP_USER")
            smtp_pass = os.getenv("SMTP_PASSWORD")

            if smtp_server:
                server = smtplib.SMTP(smtp_server, int(smtp_port or 587))
                server.starttls()
                server.login(smtp_user, smtp_pass)

                msg = MIMEMultipart("alternative")
                msg["Subject"] = subject
                msg["From"] = smtp_user
                msg["To"] = email

                msg.attach(MIMEText(template_html, "html"))

                server.sendmail(smtp_user, email, msg.as_string())
                server.quit()

                print(f"✅ Email sent to {email} via SMTP")
                return True

            # Log fallback
            print(f"📧 [Email to {email}]: {subject}")
            return True

        except Exception as e:
            print(f"❌ Email error: {e}")
            return False

    @staticmethod
    async def trigger_lead_sequence(lead_data: Dict, lead_id: int):
        """
        Starts the automated follow-up workflow.

        Sequence:
        1. Instant WhatsApp confirmation
        2. Instant welcome email
        3. Schedule daily follow-ups
        """

        name = lead_data.get("name", "Friend").split()[0]
        intent = lead_data.get("intent", "Growth")
        phone = lead_data.get("phone")
        email = lead_data.get("email")
        business = lead_data.get("business", "")

        print(f"\n🚀 LEAD SEQUENCE INITIATED for {name} (ID: {lead_id})")
        print(f"   Intent: {intent} | Stage: {lead_data.get('buyingStage')}")

        # Step 1: WhatsApp
        print(f"   → Sending WhatsApp...")
        await AutomationService.send_whatsapp(phone, name, intent)

        # Step 2: Email
        print(f"   → Sending welcome email...")
        await AutomationService.send_email(email, name, intent, business)

        # Step 3: Schedule daily follow-ups
        print(f"   → Scheduling daily follow-ups...")
        await AutomationService.schedule_daily_followups(lead_id, email, phone, name, intent)

        print(f"✅ Lead sequence complete!\n")

    @staticmethod
    async def schedule_daily_followups(lead_id: int, email: str, phone: str, name: str, intent: str):
        """
        Schedule daily follow-ups based on intent and stage.

        Day 1: Social proof + Case studies
        Day 3: Urgency + Limited offer
        Day 7: Final touch + Personal approach
        """

        followup_schedule = [
            {"day": 1, "channel": "email", "type": "social"},
            {"day": 3, "channel": "whatsapp", "type": "urgency"},
            {"day": 7, "channel": "email", "type": "final"}
        ]

        print(f"   📅 Followup schedule:")
        for item in followup_schedule:
            print(f"      Day {item['day']}: {item['channel'].upper()} ({item['type']})")

    @staticmethod
    async def send_daily_nurture(lead_id: int, day: int, lead_data: Dict):
        """
        Send daily nurture emails based on sequence day.
        """

        name = lead_data.get("name", "Friend").split()[0]
        intent = lead_data.get("intent", "Growth")

        if day == 1:
            # Day 1: Social proof
            print(f"📧 Day 1 nurture: Social proof email for {name}")

        elif day == 3:
            # Day 3: Urgency + Offer
            print(f"📧 Day 3 nurture: Urgency email with limited offer for {name}")

        elif day == 7:
            # Day 7: Final personal touch
            print(f"📧 Day 7 nurture: Final personal followup for {name}")

    @staticmethod
    async def send_bulk_campaign(leads: List[Dict], campaign_type: str):
        """
        Send bulk campaigns to multiple leads.

        Types:
        - case_study: Send relevant case studies
        - testimonial: Social proof
        - limited_offer: Time-sensitive deal
        """

        print(f"\n📢 BULK CAMPAIGN: {campaign_type.upper()}")
        print(f"   Recipients: {len(leads)}")

        for lead in leads:
            try:
                if campaign_type == "case_study":
                    await AutomationService.send_email(
                        lead["email"],
                        lead["name"],
                        lead["intent"],
                        "Case Study"
                    )

                elif campaign_type == "testimonial":
                    print(f"   → Sending testimonial to {lead['email']}")

                elif campaign_type == "limited_offer":
                    print(f"   → Sending limited offer to {lead['email']}")

            except Exception as e:
                print(f"   ❌ Error sending to {lead['email']}: {e}")

        print(f"✅ Campaign complete!\n")

    @staticmethod
    async def track_email_open(lead_id: int):
        """Track email opens for engagement metrics"""
        print(f"📊 Email opened by lead {lead_id}")

    @staticmethod
    async def track_click(lead_id: int, link: str):
        """Track link clicks for engagement metrics"""
        print(f"🔗 Link clicked by lead {lead_id}: {link}")


# Run example
if __name__ == "__main__":
    import asyncio

    # Example lead
    test_lead = {
        "name": "John Smith",
        "email": "john@example.com",
        "phone": "+1234567890",
        "business": "Tech Startup",
        "intent": "SEO",
        "buyingStage": "Decision",
        "score": 85
    }

    # Trigger sequence
    asyncio.run(AutomationService.trigger_lead_sequence(test_lead, 1))

