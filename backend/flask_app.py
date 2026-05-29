"""
Flask Backend for World Cup Prediction Game
Serves frontend AND forwards requests to AWS Lambda functions
"""

import os
import json
import logging
import requests
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get the absolute path to the public folder
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PUBLIC_DIR = os.path.join(os.path.dirname(BASE_DIR), 'public')

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Get Lambda URLs from environment
LAMBDA_REGISTRATION_URL = os.getenv('LAMBDA_REGISTRATION_URL')
LAMBDA_LOGIN_URL = os.getenv('LAMBDA_LOGIN_URL')
LAMBDA_TEAM_ASSIGNMENT_URL = os.getenv('LAMBDA_TEAM_ASSIGNMENT_URL')

# Log startup
logger.info("=" * 60)
logger.info("Flask Backend Starting")
logger.info("=" * 60)
logger.info(f"Base Directory: {BASE_DIR}")
logger.info(f"Public Directory: {PUBLIC_DIR}")
logger.info(f"Public Directory Exists: {os.path.exists(PUBLIC_DIR)}")
logger.info(f"Index.html Exists: {os.path.exists(os.path.join(PUBLIC_DIR, 'index.html'))}")
logger.info(f"Registration Lambda URL: {LAMBDA_REGISTRATION_URL}")
logger.info(f"Login Lambda URL: {LAMBDA_LOGIN_URL}")
logger.info(f"Team Assignment Lambda URL: {LAMBDA_TEAM_ASSIGNMENT_URL}")
logger.info("=" * 60)


# ============================================================================
# FRONTEND ROUTES
# ============================================================================

@app.route('/')
def index():
    """Serve the main HTML file"""
    logger.info("[FRONTEND] Serving index.html")
    index_path = os.path.join(PUBLIC_DIR, 'index.html')
    logger.info(f"[FRONTEND] Index path: {index_path}")
    logger.info(f"[FRONTEND] Index exists: {os.path.exists(index_path)}")
    
    try:
        return send_file(index_path, mimetype='text/html')
    except Exception as e:
        logger.error(f"[FRONTEND] Error serving index.html: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/src/<path:path>')
def serve_src(path):
    """Serve files from src folder"""
    logger.info(f"[FRONTEND] Serving src file: {path}")
    file_path = os.path.join(PUBLIC_DIR, 'src', path)
    logger.info(f"[FRONTEND] File path: {file_path}")
    logger.info(f"[FRONTEND] File exists: {os.path.exists(file_path)}")
    
    try:
        return send_file(file_path)
    except Exception as e:
        logger.error(f"[FRONTEND] Error serving src file: {str(e)}")
        return jsonify({'error': str(e)}), 404


# ============================================================================
# API ROUTES
# ============================================================================

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    logger.info("[HEALTH] Health check requested")
    return jsonify({
        'status': 'success',
        'message': 'Flask backend is running'
    }), 200


@app.route('/api/register', methods=['POST'])
def register():
    """Forward registration request to Lambda"""
    try:
        logger.info("[REGISTER] Registration request received")
        
        # Get request data
        data = request.get_json()
        logger.info(f"[REGISTER] Request data: {data}")
        
        # Validate required fields
        if not data or not all(k in data for k in ['email', 'username', 'password', 'office_location']):
            logger.error("[REGISTER] Missing required fields")
            logger.error(f"[REGISTER] Received fields: {list(data.keys()) if data else 'None'}")
            return jsonify({
                'status': 'error',
                'message': 'Missing required fields'
            }), 400
        
        # Create Lambda event format
        lambda_event = {
            'body': json.dumps({
                'email': data.get('email'),
                'username': data.get('username'),
                'password': data.get('password'),
                'office_location': data.get('office_location')
            })
        }
        
        logger.info(f"[REGISTER] Forwarding to Lambda: {LAMBDA_REGISTRATION_URL}")
        logger.info(f"[REGISTER] Lambda event: {lambda_event}")
        
        try:
            response = requests.post(
                LAMBDA_REGISTRATION_URL,
                json=lambda_event,
                timeout=30
            )
            
            logger.info(f"[REGISTER] Lambda response status: {response.status_code}")
            logger.info(f"[REGISTER] Lambda response: {response.text}")
            
            # Parse Lambda response
            lambda_response = response.json()
            
            # Lambda returns wrapped response, extract the actual response
            if 'body' in lambda_response:
                try:
                    actual_response = json.loads(lambda_response['body'])
                    status_code = lambda_response.get('statusCode', 200)
                    return actual_response, status_code
                except json.JSONDecodeError:
                    return lambda_response, response.status_code
            else:
                return lambda_response, response.status_code
            
        except requests.exceptions.Timeout:
            logger.error("[REGISTER] Lambda request timed out (30 seconds)")
            return jsonify({
                'status': 'error',
                'message': 'Lambda request timed out',
                'error_code': 'TIMEOUT'
            }), 504
            
        except requests.exceptions.ConnectionError as e:
            logger.error(f"[REGISTER] Cannot connect to Lambda: {str(e)}")
            return jsonify({
                'status': 'error',
                'message': 'Cannot connect to Lambda',
                'error_code': 'CONNECTION_ERROR'
            }), 503
            
        except Exception as e:
            logger.error(f"[REGISTER] Lambda request failed: {str(e)}")
            return jsonify({
                'status': 'error',
                'message': 'Lambda request failed',
                'error_code': 'LAMBDA_ERROR'
            }), 500
    
    except Exception as e:
        logger.error(f"[REGISTER] Unexpected error: {str(e)}", exc_info=True)
        return jsonify({
            'status': 'error',
            'message': 'Internal server error'
        }), 500


@app.route('/api/login', methods=['POST'])
def login():
    """Forward login request to Lambda"""
    try:
        logger.info("[LOGIN] Login request received")
        
        # Get request data
        data = request.get_json()
        logger.info(f"[LOGIN] Request data: {data}")
        
        # Validate required fields
        if not data or not all(k in data for k in ['email', 'password']):
            logger.error("[LOGIN] Missing required fields")
            return jsonify({
                'status': 'error',
                'message': 'Missing required fields'
            }), 400
        
        # Create Lambda event format
        lambda_event = {
            'body': json.dumps({
                'email': data.get('email'),
                'password': data.get('password')
            })
        }
        
        logger.info(f"[LOGIN] Forwarding to Lambda: {LAMBDA_LOGIN_URL}")
        
        try:
            response = requests.post(
                LAMBDA_LOGIN_URL,
                json=lambda_event,
                timeout=30
            )
            
            logger.info(f"[LOGIN] Lambda response status: {response.status_code}")
            logger.info(f"[LOGIN] Lambda response: {response.text}")
            
            # Parse Lambda response
            lambda_response = response.json()
            
            # Lambda returns wrapped response, extract the actual response
            if 'body' in lambda_response:
                try:
                    actual_response = json.loads(lambda_response['body'])
                    status_code = lambda_response.get('statusCode', 200)
                    return actual_response, status_code
                except json.JSONDecodeError:
                    return lambda_response, response.status_code
            else:
                return lambda_response, response.status_code
            
        except requests.exceptions.Timeout:
            logger.error("[LOGIN] Lambda request timed out (30 seconds)")
            return jsonify({
                'status': 'error',
                'message': 'Lambda request timed out',
                'error_code': 'TIMEOUT'
            }), 504
            
        except requests.exceptions.ConnectionError as e:
            logger.error(f"[LOGIN] Cannot connect to Lambda: {str(e)}")
            return jsonify({
                'status': 'error',
                'message': 'Cannot connect to Lambda',
                'error_code': 'CONNECTION_ERROR'
            }), 503
            
        except Exception as e:
            logger.error(f"[LOGIN] Lambda request failed: {str(e)}")
            return jsonify({
                'status': 'error',
                'message': 'Lambda request failed',
                'error_code': 'LAMBDA_ERROR'
            }), 500
    
    except Exception as e:
        logger.error(f"[LOGIN] Unexpected error: {str(e)}", exc_info=True)
        return jsonify({
            'status': 'error',
            'message': 'Internal server error'
        }), 500


@app.route('/api/team-assignment', methods=['POST'])
def team_assignment():
    """Forward team assignment request to Lambda"""
    try:
        logger.info("[TEAM_ASSIGNMENT] Team assignment request received")
        
        # Get request data
        data = request.get_json()
        logger.info(f"[TEAM_ASSIGNMENT] Request data: {data}")
        
        # Validate required fields
        if not data or not all(k in data for k in ['user_id', 'jwt_token']):
            logger.error("[TEAM_ASSIGNMENT] Missing required fields")
            return jsonify({
                'status': 'error',
                'message': 'Missing required fields'
            }), 400
        
        # Create Lambda event format
        lambda_event = {
            'body': json.dumps({
                'action': data.get('action', 'assign_team'),
                'user_id': data.get('user_id'),
                'jwt_token': data.get('jwt_token'),
                'country': data.get('country'),
                'player_name': data.get('player_name')
            })
        }
        
        logger.info(f"[TEAM_ASSIGNMENT] Forwarding to Lambda: {LAMBDA_TEAM_ASSIGNMENT_URL}")
        
        try:
            response = requests.post(
                LAMBDA_TEAM_ASSIGNMENT_URL,
                json=lambda_event,
                timeout=30
            )
            
            logger.info(f"[TEAM_ASSIGNMENT] Lambda response status: {response.status_code}")
            logger.info(f"[TEAM_ASSIGNMENT] Lambda response: {response.text}")
            
            # Parse Lambda response
            lambda_response = response.json()
            
            # Lambda returns wrapped response, extract the actual response
            if 'body' in lambda_response:
                try:
                    actual_response = json.loads(lambda_response['body'])
                    status_code = lambda_response.get('statusCode', 200)
                    return actual_response, status_code
                except json.JSONDecodeError:
                    return lambda_response, response.status_code
            else:
                return lambda_response, response.status_code
            
        except requests.exceptions.Timeout:
            logger.error("[TEAM_ASSIGNMENT] Lambda request timed out (30 seconds)")
            return jsonify({
                'status': 'error',
                'message': 'Lambda request timed out',
                'error_code': 'TIMEOUT'
            }), 504
            
        except requests.exceptions.ConnectionError as e:
            logger.error(f"[TEAM_ASSIGNMENT] Cannot connect to Lambda: {str(e)}")
            return jsonify({
                'status': 'error',
                'message': 'Cannot connect to Lambda',
                'error_code': 'CONNECTION_ERROR'
            }), 503
            
        except Exception as e:
            logger.error(f"[TEAM_ASSIGNMENT] Lambda request failed: {str(e)}")
            return jsonify({
                'status': 'error',
                'message': 'Lambda request failed',
                'error_code': 'LAMBDA_ERROR'
            }), 500
    
    except Exception as e:
        logger.error(f"[TEAM_ASSIGNMENT] Unexpected error: {str(e)}", exc_info=True)
        return jsonify({
            'status': 'error',
            'message': 'Internal server error'
        }), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)