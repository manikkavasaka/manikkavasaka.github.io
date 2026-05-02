from twilio.rest import Client
import os
from dotenv import load_dotenv

load_dotenv()

# Twilio Credentials from .env
account_sid = os.getenv('TWILIO_ACCOUNT_SID')
auth_token = os.getenv('TWILIO_AUTH_TOKEN')
from_number = os.getenv('TWILIO_WHATSAPP_FROM', 'whatsapp:+14155238886')

def send_whatsapp(to, message):
    if not all([account_sid, auth_token, from_number]):
        print("Twilio credentials missing in .env")
        print(f"DEBUG: SID={'OK' if account_sid else 'Missing'}, Token={'OK' if auth_token else 'Missing'}, From={'OK' if from_number else 'Missing'}")
        return None
    
    client = Client(account_sid, auth_token)
    
    try:
        # Format the numbers correctly for Twilio WhatsApp API
        formatted_to = to if to.startswith('whatsapp:') else f'whatsapp:{to}'
        formatted_from = from_number if from_number.startswith('whatsapp:') else f'whatsapp:{from_number}'
        
        print(f"Sending from {formatted_from} to {formatted_to}...")
        
        result = client.messages.create(
            from_=formatted_from,
            body=message,
            to=formatted_to
        )
        print(f"WhatsApp sent successfully! SID: {result.sid}")
        return result
    except Exception as e:
        print(f"Failed to send WhatsApp: {e}")
        if "63007" in str(e):
            print("TIP: The 'From' number in .env might be incorrect. Try using 'whatsapp:+14155238886' (Twilio Sandbox).")
        if "21608" in str(e):
            print("TIP: The recipient number hasn't joined your sandbox. Send 'join <sandbox-keyword>' to the sandbox number.")
        return None

if __name__ == "__main__":
    # Use TEST_PHONE_NUMBER from .env or a default
    test_number = os.getenv('TEST_PHONE_NUMBER', '+917200059453')
    msg = "Hello from MK ShopZone! This is a test WhatsApp message."
    print(f"Running WhatsApp test for: {test_number}")
    send_whatsapp(test_number, msg)
