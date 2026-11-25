"""All Africa's Talking calls live here."""

import os

import requests
from dotenv import load_dotenv

load_dotenv()

AT_USERNAME = os.getenv("AT_USERNAME", "")
AT_API_KEY = os.getenv("AT_API_KEY", "")

SANDBOX_BASE_URL = "https://api.sandbox.africastalking.com"
LIVE_BASE_URL = "https://api.africastalking.com"
MESSAGING_PATH = "/version1/messaging"
TIMEOUT_SECONDS = 30


class SMSError(Exception):
    """Raised when the SMS request cannot be completed."""


def base_url():
    return SANDBOX_BASE_URL if AT_USERNAME == "sandbox" else LIVE_BASE_URL


def send_bulk_sms(phone_numbers, message):
    """Send one message to all phone_numbers in a single API call.

    Returns a list of dicts, one per recipient, with keys:
    phone, status, status_code, message_id, cost.
    Raises SMSError if the request fails or the response is unusable.
    """
    if not AT_USERNAME or not AT_API_KEY:
        raise SMSError("AT_USERNAME and AT_API_KEY must be set in .env.")
    if not phone_numbers:
        raise SMSError("No recipients to send to.")

    url = base_url() + MESSAGING_PATH
    headers = {
        "apiKey": AT_API_KEY,
        "Accept": "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
    }
    data = {
        "username": AT_USERNAME,
        "to": ",".join(phone_numbers),
        "message": message,
    }

    try:
        resp = requests.post(url, headers=headers, data=data, timeout=TIMEOUT_SECONDS)
    except requests.RequestException as exc:
        raise SMSError(f"Could not reach Africa's Talking: {exc}") from exc

    try:
        payload = resp.json()
    except ValueError:
        payload = None

    # Print the raw response once per send so the recipient statuses can be checked.
    print("=== Africa's Talking raw response ===")
    print(f"HTTP {resp.status_code}")
    print(resp.text)
    print("=====================================")

    if resp.status_code >= 400 or payload is None:
        raise SMSError(
            f"Africa's Talking returned HTTP {resp.status_code}. "
            "Check the terminal for the raw response."
        )

    try:
        recipients = payload["SMSMessageData"]["Recipients"]
    except (KeyError, TypeError) as exc:
        raise SMSError("Unexpected response format from Africa's Talking.") from exc

    results = []
    for r in recipients:
        results.append(
            {
                "phone": r.get("number", ""),
                "status": r.get("status", ""),
                "status_code": r.get("statusCode"),
                "message_id": r.get("messageId"),
                "cost": r.get("cost"),
            }
        )

    # Any requested number missing from the response is recorded as unknown.
    returned = {r["phone"] for r in results}
    for phone in phone_numbers:
        if phone not in returned:
            results.append(
                {
                    "phone": phone,
                    "status": "NoResponse",
                    "status_code": None,
                    "message_id": None,
                    "cost": None,
                }
            )

    return results
