"""Email delivery service supporting SMTP, SendGrid-ready configurations, and development fallback."""

import logging
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import Optional
from app.core.config import settings

logger = logging.getLogger("caseintel.services.email")


def _send_email_smtp(
    to_email: str,
    subject: str,
    html_content: str,
    text_content: str,
) -> bool:
    """Send an email using configured SMTP credentials."""
    if not settings.SMTP_HOST:
        logger.warning(f"SMTP host not configured. Skipping live delivery to {to_email}")
        return False

    message = MIMEMultipart("alternative")
    message["Subject"] = subject
    message["From"] = f"{settings.EMAILS_FROM_NAME} <{settings.EMAILS_FROM_EMAIL}>"
    message["To"] = to_email

    part1 = MIMEText(text_content, "plain")
    part2 = MIMEText(html_content, "html")
    message.attach(part1)
    message.attach(part2)

    try:
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            if settings.SMTP_TLS:
                server.starttls()
            if settings.SMTP_USER and settings.SMTP_PASSWORD:
                server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.send_message(message)
        logger.info(f"Email sent successfully to {to_email}")
        return True
    except Exception as exc:
        logger.error(f"Failed to deliver email to {to_email}: {str(exc)}", exc_info=True)
        return False


def send_password_reset_email(email: str, token: str) -> None:
    """Send a password reset link to user's registered email."""
    reset_url = f"{settings.FRONTEND_URL}/reset-password?token={token}"
    subject = "Reset Your CaseIntel Password"
    text_content = (
        f"You requested to reset your CaseIntel password.\n\n"
        f"Click the link below to set a new password:\n{reset_url}\n\n"
        f"This link will expire in {settings.PASSWORD_RESET_TOKEN_EXPIRE_MINUTES} minutes.\n"
        f"If you did not request this, please ignore this email."
    )
    html_content = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #1e3a8a;">CaseIntel Password Reset</h2>
        <p>You requested to reset your password for your CaseIntel account.</p>
        <p style="margin: 24px 0;">
            <a href="{reset_url}" style="background-color: #1e3a8a; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Password</a>
        </p>
        <p style="color: #64748b; font-size: 14px;">This link expires in {settings.PASSWORD_RESET_TOKEN_EXPIRE_MINUTES} minutes.</p>
        <p style="color: #64748b; font-size: 14px;">If you didn't request a password reset, you can safely ignore this email.</p>
    </div>
    """

    if settings.EMAILS_ENABLED:
        _send_email_smtp(email, subject, html_content, text_content)
    else:
        # Development / test mode logging
        logger.info(f"[DEV EMAIL] Password reset requested for {email}. Reset URL: {reset_url}")


def send_verification_email(email: str, token: str) -> None:
    """Send an account verification link."""
    verify_url = f"{settings.FRONTEND_URL}/verify-email?token={token}"
    subject = "Verify Your CaseIntel Account"
    text_content = (
        f"Welcome to CaseIntel!\n\n"
        f"Please verify your email address by clicking the link below:\n{verify_url}\n\n"
        f"This link will expire in {settings.EMAIL_VERIFICATION_TOKEN_EXPIRE_HOURS} hours."
    )
    html_content = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #1e3a8a;">Welcome to CaseIntel</h2>
        <p>Thank you for creating an account. Please verify your email address to get started.</p>
        <p style="margin: 24px 0;">
            <a href="{verify_url}" style="background-color: #1e3a8a; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Verify Email</a>
        </p>
        <p style="color: #64748b; font-size: 14px;">This link expires in {settings.EMAIL_VERIFICATION_TOKEN_EXPIRE_HOURS} hours.</p>
    </div>
    """

    if settings.EMAILS_ENABLED:
        _send_email_smtp(email, subject, html_content, text_content)
    else:
        logger.info(f"[DEV EMAIL] Verification email requested for {email}. Verify URL: {verify_url}")
