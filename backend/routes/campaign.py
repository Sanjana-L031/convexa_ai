from flask import Blueprint, request, jsonify
from services.ai_service import generate_message
from services.whatsapp_service import send_whatsapp

campaign_routes = Blueprint("campaign", __name__)

@campaign_routes.route("/trigger", methods=["POST"])
def trigger_campaign():
    data = request.json

    message = generate_message(data)

    # Send WhatsApp
    send_whatsapp(data["phone"], message)

    return jsonify({
        "status": "sent",
        "message": message
    })