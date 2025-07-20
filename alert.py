from twilio.rest import Client
import requests

def get_location():
    """Fetches real-time location using an IP-based geolocation API."""
    try:
        response = requests.get("https://ipinfo.io/json")  # IP-based location fetching
        data = response.json()
        location = f"{data.get('city', 'Unknown City')}, {data.get('region', 'Unknown Region')}, {data.get('country', 'Unknown Country')}"
        return location
    except Exception as e:
        print(f"❌ Error fetching location: {e}")
        return "Location Not Available"

def send_alert_message(to, criminal_name):
    """Sends an SMS alert when a criminal is detected, including their name and location."""
    location = get_location()  # Fetch dynamic location
    alert_body = f"🚨 Alert! {criminal_name} detected at {location}. Stay alert!"

    print(f"📢 Sending message: {alert_body}")  # Debugging Statement

    # Twilio credentials
    account_sid = 'AC3f0f7ddc5e2ac9eda836a2d3fa1e03d4'
    auth_token = '110f47e77b4e7ee8d64dfb7bcc76f80a'
    client = Client(account_sid, auth_token)

    try:
        message = client.messages.create(
            from_='+19207827395',
            to=to,  # Recipient number (Dynamic input)
            body=alert_body
        )
        print(f"✅ Message Sent Successfully! Message SID: {message.sid}")  # Debugging
    except Exception as e:
        print(f"❌ Error Sending Message: {e}")


