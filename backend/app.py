from flask import Flask
from flask_cors import CORS
from routes.campaign import campaign_routes
from routes.analytics import analytics_routes

app = Flask(__name__)
CORS(app)

app.register_blueprint(campaign_routes, url_prefix="/api/campaign")
app.register_blueprint(analytics_routes, url_prefix="/api/analytics")

@app.route("/")
def home():
    return "Backend is running!"

if __name__ == "__main__":
    app.run(debug=True)
