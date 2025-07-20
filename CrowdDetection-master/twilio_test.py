from twilio.rest import Client

# Twilio credentials (from the Twilio Console)
account_sid = 'AC3f0f7ddc5e2ac9eda836a2d3fa1e03d4'
auth_token = '110f47e77b4e7ee8d64dfb7bcc76f80a'
twilio_number = '19207827395'
to_number ='9966027333'

client = Client(account_sid, auth_token)

try:
    message = client.messages.create(
        body="Test message from Twilio!",
        from_=twilio_number,
        to=to_number
    )
    print(f"Message sent successfully! SID: {message.sid}")
except Exception as e:
    print(f"Failed to send message: {e}")
