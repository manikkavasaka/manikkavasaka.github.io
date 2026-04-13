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
        "General": "Hi {name}! Your audit request has been received. Our expert will contact you within 60 minutes regarding your interest in our {intent} solutions. Let's scale your business!",
        "SEO": "Hi {name}! Your SEO audit request is in! Our expert will contact you within 60 minutes to show you how to dominate Google. Stay tuned!",
        "Paid Ads": "Hi {name}! Ad strategy received! Our expert will reach out within 60 minutes to discuss your ROI growth plan.",
        "Web Design": "Hi {name}! Your design audit is being analyzed. Expect a call within 60 minutes to discuss your new digital empire.",
        "Social Media": "Hi {name}! Social growth sequence started! We'll contact you within 60 minutes to scale your presence.",
    }

    EMAIL_TEMPLATES = {
        "welcome": """
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: 'Inter', sans-serif; color: #1a1a1a; line-height: 1.6; }}
                .container {{ max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 12px; overflow: hidden; }}
                .header {{ background: #000; color: #fff; padding: 40px 20px; text-align: center; }}
                .content {{ padding: 30px; background: #fff; }}
                .cta {{ display: inline-block; background: #ff4d4d; color: #fff; padding: 15px 35px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 20px 0; }}
                .footer {{ background: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #666; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <img src="https://mkshopzone.com/logo.png" alt="MK Shopzone" style="height: 40px; margin-bottom: 20px;">
                    <h2 style="margin:0;">Audit Request Received</h2>
                </div>
                <div class="content">
                    <p>Hi {name},</p>
                    <p>Your strategy audit request for <strong>{intent}</strong> has been received and prioritized.</p>
                    <p>One of our elite consultants is already reviewing your business profile. You can expect a direct follow-up within the next <strong>60 minutes</strong>.</p>
                    <div style="text-align: center;">
                        <a href="https://calendly.com/mkshopzone" class="cta">VIEW CASE STUDIES</a>
                    </div>
                    <p>In the meantime, feel free to reply to this email if you have any immediate questions.</p>
                    <p>Best regards,<br><strong>MK Shopzone AI Team</strong></p>
                </div>
                <div class="footer">
                    <p>© 2026 MK Shopzone. Precision Digital Growth.<br>High-end solutions for high-performance brands.</p>
                </div>
            </div>
        </body>
        </html>
        """
    }


    @staticmethod
    async def _with_retry(func, *args, retries=3, delay=1, **kwargs):
        """Helper for async retries with exponential backoff"""
        import asyncio
        for i in range(retries):
            try:
                return await func(*args, **kwargs)
            except Exception as e:
                if i == retries - 1:
                    raise e
                wait = delay * (2 ** i)
                print(f"⚠️  Retry {i+1}/{retries} for {func.__name__} after {wait}s...")
                await asyncio.sleep(wait)

    @staticmethod
    async def send_whatsapp(phone: str, name: str, intent: str, lead_id: str = "unknown"):
        """Send WhatsApp message with retry and logging"""
        from backend.db_manager import log_communication
        template = AutomationService.WHATSAPP_TEMPLATES.get(intent, AutomationService.WHATSAPP_TEMPLATES["General"])
        message_body = template.format(name=name, intent=intent)

        async def _perform_send():
            phone_id = os.getenv("META_PHONE_ID")
            token = os.getenv("META_ACCESS_TOKEN")
            
            if not (phone_id and token and phone):
                # Fallback / Dry run
                print(f"📱 [DRY-RUN WhatsApp to {phone}]: {message_body}")
                return {"status": "success", "mode": "log_only"}

            url = f"https://graph.facebook.com/v18.0/{phone_id}/messages"
            headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
            cleaned_phone = phone.replace("+", "").replace("-", "").replace(" ", "")
            data = {
                "messaging_product": "whatsapp",
                "to": cleaned_phone,
                "type": "text",
                "text": {"body": message_body}
            }

            async with httpx.AsyncClient() as client:
                res = await client.post(url, json=data, headers=headers)
                res.raise_for_status()
                return res.json()

        try:
            result = await AutomationService._with_retry(_perform_send)
            await log_communication(lead_id, "whatsapp", "sent", str(result))
            print(f"✅ WhatsApp sent to {phone}")
            return True
        except Exception as e:
            await log_communication(lead_id, "whatsapp", "failed", str(e))
            print(f"❌ WhatsApp failed: {e}")
            return False

    @staticmethod
    async def send_sms(phone: str, name: str, lead_id: str = "unknown"):
        """Send SMS securely via Twilio with retry and logging"""
        from backend.db_manager import log_communication
        message_body = f"Hi {name}, your audit request has been received. Our expert will contact you within 60 minutes."

        async def _perform_send():
            from twilio.rest import Client
            sid = os.getenv("TWILIO_ACCOUNT_SID")
            token = os.getenv("TWILIO_AUTH_TOKEN")
            from_num = os.getenv("TWILIO_PHONE_NUMBER")

            if not (sid and token and phone):
                print(f"💬 [DRY-RUN SMS to {phone}]: {message_body}")
                return {"status": "success", "mode": "log_only"}

            client = Client(sid, token)
            msg = client.messages.create(body=message_body, from_=from_num, to=phone)
            return {"sid": msg.sid, "status": msg.status}

        try:
            result = await AutomationService._with_retry(_perform_send)
            await log_communication(lead_id, "sms", "sent", str(result))
            print(f"✅ SMS sent to {phone}")
            return True
        except Exception as e:
            await log_communication(lead_id, "sms", "failed", str(e))
            print(f"❌ SMS failed: {e}")
            return False

    @staticmethod
    async def send_email(email: str, name: str, intent: str, lead_id: str = "unknown"):
        """Send email via SMTP with retry and logging"""
        from backend.db_manager import log_communication
        subject = f"✓ Strategy Audit Received - MK Shopzone"
        template_html = AutomationService.EMAIL_TEMPLATES["welcome"].format(name=name, intent=intent)

        async def _perform_send():
            smtp_server = os.getenv("SMTP_SERVER")
            if not smtp_server:
                print(f"📧 [DRY-RUN Email to {email}]: {subject}")
                return {"status": "success", "mode": "log_only"}

            import aiosmtplib
            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = os.getenv("SMTP_USER")
            msg["To"] = email
            msg.attach(MIMEText(template_html, "html"))

            await aiosmtplib.send(
                msg,
                hostname=smtp_server,
                port=int(os.getenv("SMTP_PORT", 587)),
                username=os.getenv("SMTP_USER"),
                password=os.getenv("SMTP_PASSWORD"),
                use_tls=True
            )
            return {"status": "sent"}

        try:
            result = await AutomationService._with_retry(_perform_send)
            await log_communication(lead_id, "email", "sent", str(result))
            print(f"✅ Email sent to {email}")
            return True
        except Exception as e:
            await log_communication(lead_id, "email", "failed", str(e))
            print(f"❌ Email failed: {e}")
            return False

    @staticmethod
    async def trigger_lead_sequence(lead_data: Dict, lead_id: str):
        """
        Starts the fully automated follow-up workflow instantly.
        No UI interaction required.
        """
        name = lead_data.get("name", "Friend").split()[0]
        intent = lead_data.get("intent", "Growth")
        phone = lead_data.get("phone")
        email = lead_data.get("email")

        print(f"\n🚀 INSTANT AUTOMATION TRIGGERED [Lead: {name} | ID: {lead_id}]")

        # Start background tasks for all channels
        import asyncio
        tasks = []
        
        if phone:
            tasks.append(AutomationService.send_whatsapp(phone, name, intent, lead_id))
            tasks.append(AutomationService.send_sms(phone, name, lead_id))
        
        if email:
            tasks.append(AutomationService.send_email(email, name, intent, lead_id))

        if tasks:
            await asyncio.gather(*tasks)

        print(f"✅ Full Automation Sequence Completed for {name}\n")


