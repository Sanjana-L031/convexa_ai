from flask import Blueprint, jsonify

analytics_routes = Blueprint("analytics", __name__)

@analytics_routes.route("/", methods=["GET"])
def get_analytics():
    data = [
        {"day": "Mon", "revenue": 5000},
        {"day": "Tue", "revenue": 8000},
        {"day": "Wed", "revenue": 12000},
    ]

    return jsonify(data)