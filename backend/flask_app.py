"""
Flask Backend for World Cup Prediction Game
Serves frontend AND forwards requests to AWS Lambda functions
"""

import os
import json
import logging
import requests
import mysql.connector
from datetime import datetime
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
LAMBDA_LEADERBOARD_URL = os.getenv('LAMBDA_LEADERBOARD_URL')
LAMBDA_USER_PREDICTIONS_URL = os.getenv('LAMBDA_USER_PREDICTIONS_URL')

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
logger.info(f"Leaderboard Lambda URL: {LAMBDA_LEADERBOARD_URL}")
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

@app.route('/api/matches', methods=['GET'])
def get_matches():
    """
    Forward matches request to Lambda
    """
    try:
        logger.info("[GET_MATCHES] Matches request received")
        
        
# Get optional status filter

        status_filter = request.args.get('status', None)
        
        
# Get Lambda URL from environment

        LAMBDA_MATCHES_URL = os.getenv('LAMBDA_MATCHES_URL')
        
        if not LAMBDA_MATCHES_URL:
            logger.error("[GET_MATCHES] Lambda URL not configured")
            return jsonify({
                'status': 'error',
                'message': 'Lambda URL not configured'
            }), 500
        
        
# Build query string

        query_string = ""
        if status_filter:
            query_string = f"?status={status_filter}"
        
        logger.info(f"[GET_MATCHES] Forwarding to Lambda: {LAMBDA_MATCHES_URL}{query_string}")
        
        try:
            response = requests.get(
                f"{LAMBDA_MATCHES_URL}{query_string}",
                timeout=30
            )
            
            logger.info(f"[GET_MATCHES] Lambda response status: {response.status_code}")
            logger.info(f"[GET_MATCHES] Lambda response: {response.text}")
            
            
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
            logger.error("[GET_MATCHES] Lambda request timed out (30 seconds)")
            return jsonify({
                'status': 'error',
                'message': 'Lambda request timed out',
                'error_code': 'TIMEOUT'
            }), 504
        
        except requests.exceptions.ConnectionError as e:
            logger.error(f"[GET_MATCHES] Cannot connect to Lambda: {str(e)}")
            return jsonify({
                'status': 'error',
                'message': 'Cannot connect to Lambda',
                'error_code': 'CONNECTION_ERROR'
            }), 503
        
        except Exception as e:
            logger.error(f"[GET_MATCHES] Lambda request failed: {str(e)}")
            return jsonify({
                'status': 'error',
                'message': 'Lambda request failed',
                'error_code': 'LAMBDA_ERROR'
            }), 500
    
    except Exception as e:
        logger.error(f"[GET_MATCHES] Unexpected error: {str(e)}", exc_info=True)
        return jsonify({
            'status': 'error',
            'message': 'Internal server error'
        }), 500
    
@app.route('/api/predict', methods=['POST'])
def submit_prediction():
    """
    Submit a score prediction for a match
    Forwards request to Lambda score_prediction function
    
    Request Body:
    {
        "user_id": 42,
        "jwt_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "match_id": "match_001",
        "predicted_home_score": 2,
        "predicted_away_score": 1
    }
    
    Response:
    {
        "status": "success",
        "message": "Prediction submitted successfully",
        "user_id": 42,
        "match_id": "match_001",
        "predicted_home_score": 2,
        "predicted_away_score": 1,
        "points_earned": 0
    }
    """
    try:
        logger.info("[PREDICT] Prediction submission request received")
        
        # Get request data
        data = request.get_json()
        logger.info(f"[PREDICT] Request data: {data}")
        
        # Validate required fields
        required_fields = ['user_id', 'jwt_token', 'match_id', 'predicted_home_score', 'predicted_away_score']
        if not data or not all(field in data for field in required_fields):
            logger.error("[PREDICT] Missing required fields")
            return jsonify({
                'status': 'error',
                'message': 'Missing required fields'
            }), 400
        
        # Get Lambda URL from environment
        LAMBDA_SCORE_PREDICTION_URL = os.getenv('LAMBDA_SCORE_PREDICTION_URL')
        
        if not LAMBDA_SCORE_PREDICTION_URL:
            logger.error("[PREDICT] Lambda URL not configured")
            return jsonify({
                'status': 'error',
                'message': 'Lambda URL not configured'
            }), 500
        
        # Create Lambda event format
        lambda_event = {
            'body': json.dumps({
                'action': 'submit_prediction',
                'user_id': data.get('user_id'),
                'jwt_token': data.get('jwt_token'),
                'match_id': data.get('match_id'),
                'predicted_home_score': data.get('predicted_home_score'),
                'predicted_away_score': data.get('predicted_away_score')
            })
        }
        
        logger.info(f"[PREDICT] Forwarding to Lambda: {LAMBDA_SCORE_PREDICTION_URL}")
        
        try:
            response = requests.post(
                LAMBDA_SCORE_PREDICTION_URL,
                json=lambda_event,
                timeout=30
            )
            
            logger.info(f"[PREDICT] Lambda response status: {response.status_code}")
            logger.info(f"[PREDICT] Lambda response: {response.text}")
            
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
            logger.error("[PREDICT] Lambda request timed out (30 seconds)")
            return jsonify({
                'status': 'error',
                'message': 'Lambda request timed out',
                'error_code': 'TIMEOUT'
            }), 504
        
        except requests.exceptions.ConnectionError as e:
            logger.error(f"[PREDICT] Cannot connect to Lambda: {str(e)}")
            return jsonify({
                'status': 'error',
                'message': 'Cannot connect to Lambda',
                'error_code': 'CONNECTION_ERROR'
            }), 503
        
        except Exception as e:
            logger.error(f"[PREDICT] Lambda request failed: {str(e)}")
            return jsonify({
                'status': 'error',
                'message': 'Lambda request failed',
                'error_code': 'LAMBDA_ERROR'
            }), 500
    
    except Exception as e:
        logger.error(f"[PREDICT] Unexpected error: {str(e)}", exc_info=True)
        return jsonify({
            'status': 'error',
            'message': 'Internal server error'
        }), 500
    
@app.route('/api/matches/<match_id>', methods=['GET'])
def get_match_details(match_id):
    """
    Get details for a specific match
    
    Response:
    {
        "status": "success",
        "match": {
            "match_id": "match_001",
            "home_team": "Brazil",
            "away_team": "Morocco",
            "match_date_utc": "2026-06-15T20:00:00",
            "home_score": null,
            "away_score": null,
            "status": "scheduled"
        }
    }
    """
    try:
        logger.info(f"[GET_MATCH_DETAILS] Fetching details for match: {match_id}")
        
        try:
            connection = mysql.connector.connect(
                host=os.getenv('DB_HOST'),
                user=os.getenv('DB_USER'),
                password=os.getenv('DB_PASSWORD'),
                database=os.getenv('DB_NAME')
            )
            cursor = connection.cursor(dictionary=True)
            
            query = """
            SELECT 
                match_id,
                home_team,
                away_team,
                match_date_utc,
                home_score,
                away_score,
                status,
                home_fifa_rank,
                away_fifa_rank
            FROM matches
            WHERE match_id = %s
            """
            
            cursor.execute(query, (match_id,))
            match = cursor.fetchone()
            
            if not match:
                logger.warning(f"[GET_MATCH_DETAILS] Match not found: {match_id}")
                return jsonify({
                    'status': 'error',
                    'message': 'Match not found'
                }), 404
            
            match_dict = {
                'match_id': match['match_id'],
                'home_team': match['home_team'],
                'away_team': match['away_team'],
                'match_date_utc': match['match_date_utc'].isoformat() if match['match_date_utc'] else None,
                'home_score': match['home_score'],
                'away_score': match['away_score'],
                'status': match['status'],
                'home_fifa_rank': match['home_fifa_rank'],
                'away_fifa_rank': match['away_fifa_rank']
            }
            
            logger.info(f"[GET_MATCH_DETAILS] Retrieved match: {match_id}")
            
            cursor.close()
            connection.close()
            
            return jsonify({
                'status': 'success',
                'message': 'Match details retrieved successfully',
                'match': match_dict
            }), 200
        
        except mysql.connector.Error as e:
            logger.error(f"[GET_MATCH_DETAILS] Database error: {str(e)}")
            return jsonify({
                'status': 'error',
                'message': 'Database connection error'
            }), 500
    
    except Exception as e:
        logger.error(f"[GET_MATCH_DETAILS] Unexpected error: {str(e)}", exc_info=True)
        return jsonify({
            'status': 'error',
            'message': 'Internal server error'
        }), 500


# ============================================================================
# ENDPOINT 4: GET /api/user-predictions/<user_id> - Get user's predictions
# ============================================================================

@app.route('/api/user-predictions/<int:user_id>', methods=['GET'])
def get_user_predictions(user_id):
    """
    Get all predictions for a specific user
    
    Response:
    {
        "status": "success",
        "user_id": 42,
        "predictions": [
            {
                "prediction_id": 1,
                "match_id": "match_001",
                "home_team": "Brazil",
                "away_team": "Morocco",
                "predicted_home_score": 2,
                "predicted_away_score": 1,
                "actual_home_score": null,
                "actual_away_score": null,
                "points_earned": 0,
                "match_status": "scheduled"
            }
        ]
    }
    """
    try:
        logger.info(f"[GET_USER_PREDICTIONS] Fetching predictions for user: {user_id}")
        
        try:
            connection = mysql.connector.connect(
                host=os.getenv('DB_HOST'),
                user=os.getenv('DB_USER'),
                password=os.getenv('DB_PASSWORD'),
                database=os.getenv('DB_NAME')
            )
            cursor = connection.cursor(dictionary=True)
            
            query = """
            SELECT 
                p.prediction_id,
                p.match_id,
                p.predicted_home_score,
                p.predicted_away_score,
                p.points_earned,
                m.home_team,
                m.away_team,
                m.home_score,
                m.away_score,
                m.status,
                m.match_date_utc
            FROM predictions p
            JOIN matches m ON p.match_id = m.match_id
            WHERE p.user_id = %s
            ORDER BY m.match_date_utc DESC
            """
            
            cursor.execute(query, (user_id,))
            predictions = cursor.fetchall()
            
            predictions_list = []
            for pred in predictions:
                pred_dict = {
                    'prediction_id': pred['prediction_id'],
                    'match_id': pred['match_id'],
                    'home_team': pred['home_team'],
                    'away_team': pred['away_team'],
                    'predicted_home_score': pred['predicted_home_score'],
                    'predicted_away_score': pred['predicted_away_score'],
                    'actual_home_score': pred['home_score'],
                    'actual_away_score': pred['away_score'],
                    'points_earned': pred['points_earned'],
                    'match_status': pred['status'],
                    'match_date': pred['match_date_utc'].isoformat() if pred['match_date_utc'] else None
                }
                predictions_list.append(pred_dict)
            
            logger.info(f"[GET_USER_PREDICTIONS] Retrieved {len(predictions_list)} predictions for user {user_id}")
            
            cursor.close()
            connection.close()
            
            return jsonify({
                'status': 'success',
                'message': 'User predictions retrieved successfully',
                'user_id': user_id,
                'total_predictions': len(predictions_list),
                'predictions': predictions_list
            }), 200
        
        except mysql.connector.Error as e:
            logger.error(f"[GET_USER_PREDICTIONS] Database error: {str(e)}")
            return jsonify({
                'status': 'error',
                'message': 'Database connection error'
            }), 500
    
    except Exception as e:
        logger.error(f"[GET_USER_PREDICTIONS] Unexpected error: {str(e)}", exc_info=True)
        return jsonify({
            'status': 'error',
            'message': 'Internal server error'
        }), 500

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
    """Forward team assignment and prediction requests to Lambda"""
    try:
        logger.info("[TEAM_ASSIGNMENT] Team assignment request received")
        
        # Get request data
        data = request.get_json()
        logger.info(f"[TEAM_ASSIGNMENT] Request data: {data}")
        
        # Validate required fields
        if not data or 'action' not in data:
            logger.error("[TEAM_ASSIGNMENT] Missing action field")
            return jsonify({
                'status': 'error',
                'message': 'Missing action field'
            }), 400
        
        # Create Lambda event format
        lambda_event = {
            'body': json.dumps(data)
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


@app.route('/api/leaderboard', methods=['POST'])
def leaderboard():
    """Forward leaderboard requests to Lambda"""
    try:
        logger.info("[LEADERBOARD] Leaderboard request received")
        
        # Get request data
        data = request.get_json()
        logger.info(f"[LEADERBOARD] Request data: {data}")
        
        # Validate required fields
        if not data or 'action' not in data:
            logger.error("[LEADERBOARD] Missing action field")
            return jsonify({
                'status': 'error',
                'message': 'Missing action field'
            }), 400
        
        # Create Lambda event format
        lambda_event = {
            'body': json.dumps(data)
        }
        
        logger.info(f"[LEADERBOARD] Forwarding to Lambda: {LAMBDA_LEADERBOARD_URL}")
        
        try:
            response = requests.post(
                LAMBDA_LEADERBOARD_URL,
                json=lambda_event,
                timeout=30
            )
            
            logger.info(f"[LEADERBOARD] Lambda response status: {response.status_code}")
            logger.info(f"[LEADERBOARD] Lambda response: {response.text}")
            
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
            logger.error("[LEADERBOARD] Lambda request timed out (30 seconds)")
            return jsonify({
                'status': 'error',
                'message': 'Lambda request timed out',
                'error_code': 'TIMEOUT'
            }), 504
            
        except requests.exceptions.ConnectionError as e:
            logger.error(f"[LEADERBOARD] Cannot connect to Lambda: {str(e)}")
            return jsonify({
                'status': 'error',
                'message': 'Cannot connect to Lambda',
                'error_code': 'CONNECTION_ERROR'
            }), 503
            
        except Exception as e:
            logger.error(f"[LEADERBOARD] Lambda request failed: {str(e)}")
            return jsonify({
                'status': 'error',
                'message': 'Lambda request failed',
                'error_code': 'LAMBDA_ERROR'
            }), 500
    
    except Exception as e:
        logger.error(f"[LEADERBOARD] Unexpected error: {str(e)}", exc_info=True)
        return jsonify({
            'status': 'error',
            'message': 'Internal server error'
        }), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)