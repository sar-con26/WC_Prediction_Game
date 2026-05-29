// api.js - CORRECTED
// API Service for communicating with Flask backend

const API_BASE_URL = (() => {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'http://localhost:5000/api';
    } else {
        return `${window.location.protocol}//${window.location.host}/api`;
    }
})();

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise} Response from server
 */
async function registerUser(userData) {
    try {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: userData.email,
                username: userData.username,
                password: userData.password,
                office_location: userData.office_location
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Registration failed');
        }

        return data;
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
}

/**
 * Login user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} Response with JWT token
 */
async function loginUser(email, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }

        return data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

/**
 * Assign team to user
 * @param {number} userId - User ID
 * @param {string} jwtToken - JWT token
 * @returns {Promise} Response with assigned team
 */
async function assignTeamToUser(userId, jwtToken) {
    try {
        const response = await fetch(`${API_BASE_URL}/team-assignment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            },
            body: JSON.stringify({
                user_id: userId,
                jwt_token: jwtToken
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Team assignment failed');
        }

        return data;
    } catch (error) {
        console.error('Team assignment error:', error);
        throw error;
    }
}

/**
 * Save tournament winner prediction
 * @param {number} userId - User ID
 * @param {string} jwtToken - JWT token
 * @param {string} country - Country prediction
 * @returns {Promise} Response
 */
async function saveTournamentWinnerPrediction(userId, jwtToken, country) {
    try {
        const response = await fetch(`${API_BASE_URL}/team-assignment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            },
            body: JSON.stringify({
                action: 'predict_tournament_winner',
                user_id: userId,
                jwt_token: jwtToken,
                country: country
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Prediction save failed');
        }

        return data;
    } catch (error) {
        console.error('Tournament winner prediction error:', error);
        throw error;
    }
}

/**
 * Save golden boot prediction
 * @param {number} userId - User ID
 * @param {string} jwtToken - JWT token
 * @param {string} playerName - Player name
 * @returns {Promise} Response
 */
async function saveGoldenBootPrediction(userId, jwtToken, playerName) {
    try {
        const response = await fetch(`${API_BASE_URL}/team-assignment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            },
            body: JSON.stringify({
                action: 'predict_golden_boot',
                user_id: userId,
                jwt_token: jwtToken,
                player_name: playerName
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Prediction save failed');
        }

        return data;
    } catch (error) {
        console.error('Golden boot prediction error:', error);
        throw error;
    }
}

/**
 * Save golden glove prediction
 * @param {number} userId - User ID
 * @param {string} jwtToken - JWT token
 * @param {string} playerName - Player name
 * @returns {Promise} Response
 */
async function saveGoldenGlovePrediction(userId, jwtToken, playerName) {
    try {
        const response = await fetch(`${API_BASE_URL}/team-assignment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            },
            body: JSON.stringify({
                action: 'predict_golden_glove',
                user_id: userId,
                jwt_token: jwtToken,
                player_name: playerName
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Prediction save failed');
        }

        return data;
    } catch (error) {
        console.error('Golden glove prediction error:', error);
        throw error;
    }
}

/**
 * Store JWT token in localStorage
 * @param {string} token - JWT token
 */
function storeJWTToken(token) {
    localStorage.setItem('jwt_token', token);
}

/**
 * Get JWT token from localStorage
 * @returns {string} JWT token or null
 */
function getJWTToken() {
    return localStorage.getItem('jwt_token');
}

/**
 * Check if user is authenticated
 * @returns {boolean} True if user has valid token
 */
function isAuthenticated() {
    return !!getJWTToken();
}

/**
 * Logout user
 */
function logoutUser() {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userOfficeLocation');
    localStorage.removeItem('assignedTeam');
    localStorage.removeItem('predictions');
    localStorage.removeItem('predictionState');
}

/**
 * Get authorization headers with JWT token
 * @returns {Object} Headers object with Authorization
 */
function getAuthHeaders() {
    const token = getJWTToken();
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}