import os
from flask import Flask, send_from_directory, request, jsonify
from flask_cors import CORS
from generator import generate_summary

# === Initialize Flask App and Enable CORS ===
app = Flask(__name__, static_folder='static', static_url_path='')
CORS(app)

# === API Endpoint to Generate Scouting Summary ===
@app.route('/summary', methods=['POST'])
def summary_api():
    try:
        report = request.get_json()  # Extract JSON payload from request
        summary = generate_summary(report)  # Call OpenAI-powered summary generator
        return jsonify({"summary": summary}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400  # Return error if summary generation fails

# === Health Check Endpoint ===
@app.route('/ping')
def ping():
    return 'pong', 200

# === Serve the Root of the React App (index.html) ===
@app.route('/')
def serve_root():
    return send_from_directory(app.static_folder, 'index.html')

# === Serve Static Files or Fallback to index.html for React Router ===
@app.route('/<path:path>')
def serve_static(path):
    full_path = os.path.join(app.static_folder, path)
    if os.path.exists(full_path):
        return send_from_directory(app.static_folder, path)  # Serve file if it exists
    else:
        return send_from_directory(app.static_folder, 'index.html')  # Fallback to index.html

# === Custom 404 Handler for React Router Support ===
@app.errorhandler(404)
def not_found(e):
    # If it's a request for a file (e.g., .js, .css), return 404
    if os.path.splitext(request.path)[1]:
        return 'File not found', 404
    # Otherwise, fallback to index.html so React Router can handle the route
    return send_from_directory(app.static_folder, 'index.html')

# === Entry Point for Gunicorn ===
application = app
