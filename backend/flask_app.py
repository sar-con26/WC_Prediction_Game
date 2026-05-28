"""
Flask Backend for World Cup Predictor
Bridges frontend to AWS Lambda functions
"""

import os
import json
import requests
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Get Lambda URLs from environment variables
LAMBDA_REGISTRATION_URL = os.getenv('LAMBDA_REGISTRATION_URL')
LAMBDA_LOGIN_URL = os.getenv('LAMBDA_LOGIN_URL')

# Validate environment variables
if not LAMBDA_REGISTRATION_URL or not LAMBDA_LOGIN_URL:
    logger.warning("⚠️  Lambda URLs not configured in .env file")
    logger.warning("Please set LAMBDA_REGISTRATION_URL and LAMBDA_LOGIN_URL")


# ============================================================================
# HEALTH CHECK ENDPOINT
# ============================================================================

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'success',
        'message': 'Flask backend is running',
        'lambda_registration_configured': bool(LAMBDA_REGISTRATION_URL),
        'lambda_login_configured': bool(LAMBDA_LOGIN_URL)
    }), 200


# ============================================================================
# REGISTRATION ENDPOINT
# ============================================================================

@app.route('/api/register', methods=['POST'])
def register():
    """
    Register a new user
    
    Request body:
    {
        "email": "user@example.com",
        "username": "john_doe",
        "password": "SecurePassword123!",
        "country_guess": "France"
    }
    """
    try:
        logger.info("[FLASK] Registration request received")
        
        # Get request data
        data = request.get_json()
        
        if not data:
            logger.error("[FLASK] No JSON data in request")
            return jsonify({
                'status': 'error',
                'message': 'No data provided',
                'error_code': 'NO_DATA'
            }), 400
        
        # Validate required fields
        required_fields = ['email', 'username', 'password', 'country_guess']
        missing_fields = [field for field in required_fields if field not in data]
        
        if missing_fields:
            logger.warning(f"[FLASK] Missing fields: {missing_fields}")
            return jsonify({
                'status': 'error',
                'message': f'Missing required fields: {", ".join(missing_fields)}',
                'error_code': 'MISSING_FIELDS'
            }), 400
        
        # Check if Lambda URL is configured
        if not LAMBDA_REGISTRATION_URL:
            logger.error("[FLASK] Lambda registration URL not configured")
            return jsonify({
                'status': 'error',
                'message': 'Server configuration error',
                'error_code': 'CONFIG_ERROR'
            }), 500
        
        # Forward request to Lambda
        logger.info(f"[FLASK] Forwarding registration request to Lambda: {LAMBDA_REGISTRATION_URL}")
        
        lambda_response = requests.post(
            LAMBDA_REGISTRATION_URL,
            json=data,
            timeout=30
        )
        
        logger.info(f"[FLASK] Lambda response status: {lambda_response.status_code}")
        
        # Parse Lambda response
        try:
            response_data = lambda_response.json()
        except json.JSONDecodeError:
            logger.error(f"[FLASK] Invalid JSON response from Lambda: {lambda_response.text}")
            return jsonify({
                'status': 'error',
                'message': 'Invalid response from Lambda',
                'error_code': 'LAMBDA_ERROR'
            }), 500
        
        # Return Lambda response to frontend
        return jsonify(response_data), lambda_response.status_code
    
    except requests.exceptions.Timeout:
        logger.error("[FLASK] Lambda request timeout")
        return jsonify({
            'status': 'error',
            'message': 'Request timeout',
            'error_code': 'TIMEOUT'
        }), 504
    
    except requests.exceptions.ConnectionError:
        logger.error("[FLASK] Cannot connect to Lambda")
        return jsonify({
            'status': 'error',
            'message': 'Cannot connect to Lambda service',
            'error_code': 'CONNECTION_ERROR'
        }), 503
    
    except Exception as e:
        logger.error(f"[FLASK] Unexpected error in registration: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'Internal server error',
            'error_code': 'INTERNAL_ERROR',
            'details': str(e)
        }), 500


# ============================================================================
# LOGIN ENDPOINT
# ============================================================================

@app.route('/api/login', methods=['POST'])
def login():
    """
    Login user
    
    Request body:
    {
        "email": "user@example.com",
        "password": "SecurePassword123!"
    }
    """
    try:
        logger.info("[FLASK] Login request received")
        
        # Get request data
        data = request.get_json()
        
        if not data:
            logger.error("[FLASK] No JSON data in request")
            return jsonify({
                'status': 'error',
                'message': 'No data provided',
                'error_code': 'NO_DATA'
            }), 400
        
        # Validate required fields
        required_fields = ['email', 'password']
        missing_fields = [field for field in required_fields if field not in data]
        
        if missing_fields:
            logger.warning(f"[FLASK] Missing fields: {missing_fields}")
            return jsonify({
                'status': 'error',
                'message': f'Missing required fields: {", ".join(missing_fields)}',
                'error_code': 'MISSING_FIELDS'
            }), 400
        
        # Check if Lambda URL is configured
        if not LAMBDA_LOGIN_URL:
            logger.error("[FLASK] Lambda login URL not configured")
            return jsonify({
                'status': 'error',
                'message': 'Server configuration error',
                'error_code': 'CONFIG_ERROR'
            }), 500
        
        # Forward request to Lambda
        logger.info(f"[FLASK] Forwarding login request to Lambda: {LAMBDA_LOGIN_URL}")
        
        lambda_response = requests.post(
            LAMBDA_LOGIN_URL,
            json=data,
            timeout=30
        )
        
        logger.info(f"[FLASK] Lambda response status: {lambda_response.status_code}")
        
        # Parse Lambda response
        try:
            response_data = lambda_response.json()
        except json.JSONDecodeError:
            logger.error(f"[FLASK] Invalid JSON response from Lambda: {lambda_response.text}")
            return jsonify({
                'status': 'error',
                'message': 'Invalid response from Lambda',
                'error_code': 'LAMBDA_ERROR'
            }), 500
        
        # Return Lambda response to frontend
        return jsonify(response_data), lambda_response.status_code
    
    except requests.exceptions.Timeout:
        logger.error("[FLASK] Lambda request timeout")
        return jsonify({
            'status': 'error',
            'message': 'Request timeout',
            'error_code': 'TIMEOUT'
        }), 504
    
    except requests.exceptions.ConnectionError:
        logger.error("[FLASK] Cannot connect to Lambda")
        return jsonify({
            'status': 'error',
            'message': 'Cannot connect to Lambda service',
            'error_code': 'CONNECTION_ERROR'
        }), 503
    
    except Exception as e:
        logger.error(f"[FLASK] Unexpected error in login: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'Internal server error',
            'error_code': 'INTERNAL_ERROR',
            'details': str(e)
        }), 500


# ============================================================================
# ERROR HANDLERS
# ============================================================================

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({
        'status': 'error',
        'message': 'Endpoint not found',
        'error_code': 'NOT_FOUND'
    }), 404


@app.errorhandler(405)
def method_not_allowed(error):
    """Handle 405 errors"""
    return jsonify({
        'status': 'error',
        'message': 'Method not allowed',
        'error_code': 'METHOD_NOT_ALLOWED'
    }), 405


@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    return jsonify({
        'status': 'error',
        'message': 'Internal server error',
        'error_code': 'INTERNAL_ERROR'
    }), 500


# ============================================================================
# MAIN
# ============================================================================

if __name__ == '__main__':
    logger.info("=" * 60)
    logger.info("Flask Backend Starting")
    logger.info("=" * 60)
    logger.info(f"Registration Lambda URL: {LAMBDA_REGISTRATION_URL}")
    logger.info(f"Login Lambda URL: {LAMBDA_LOGIN_URL}")
    logger.info("=" * 60)
    
    # Run Flask app
    # Debug=True for development, set to False for production
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=True
    )