import os
import smtplib
import logging
from email.message import EmailMessage

logger = logging.getLogger(__name__)

def send_otp_email(to_email: str, otp_code: str):
    """
    Sends an OTP email using standard SMTP (e.g. Gmail).
    Requires SMTP_EMAIL and SMTP_PASSWORD to be set in environment variables.
    """
    smtp_email = os.getenv("SMTP_EMAIL")
    smtp_password = os.getenv("SMTP_PASSWORD")
    
    # Gmail SMTP Server config
    smtp_server = "smtp.gmail.com"
    smtp_port = 587

    # Keep a fallback logger so testing locally without env variables doesn't break the app flow
    if not smtp_email or not smtp_password:
        logger.warning(f"SMTP credentials not set! OTP for {to_email} is {otp_code}")
        print(f"\n[DEV FALLBACK] Your OTP code for {to_email} is: {otp_code}\n")
        return True

    msg = EmailMessage()
    msg['Subject'] = "Your NuanceNode Verification Code"
    msg['From'] = f"NuanceNode Auth <{smtp_email}>"
    msg['To'] = to_email

    # HTML Body for a clean premium email
    html_content = f"""
    <html>
      <body style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2>Welcome to NuanceNode!</h2>
        <p>To continue setting up your account, please use the following verification code:</p>
        <div style="background-color: #f4f4f5; padding: 16px; border-radius: 8px; font-size: 24px; font-weight: bold; letter-spacing: 4px; text-align: center; width: max-content; margin: 24px 0;">
          {otp_code}
        </div>
        <p style="color: #666; font-size: 14px;">This code will expire in 10 minutes.</p>
      </body>
    </html>
    """
    msg.set_content("Your NuanceNode OTP code is: " + otp_code)
    msg.add_alternative(html_content, subtype='html')

    try:
        # Connect strictly over TLS securely
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(smtp_email, smtp_password)
            server.send_message(msg)
            
        logger.info(f"OTP email sent to {to_email} successfully via Gmail SMTP.")
        return True
    except Exception as e:
        logger.error(f"Failed to send SMTP email to {to_email}: {str(e)}")
        print(f"\n[DEV FALLBACK] Your OTP code for {to_email} is: {otp_code}\n")
        return False
