// api.js
// API Service for communicating with Flask backend

const API_BASE_URL = 'http://localhost:5000/api'; // Change to your Flask URL in production

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
                country_guess: userData.country_guess
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
    localStorage.removeItem('userCounty');
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