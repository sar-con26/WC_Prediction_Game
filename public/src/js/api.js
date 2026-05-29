// api.js
// API Service for communicating with Flask backend

// Determine API base URL dynamically
const API_BASE_URL = (() => {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'http://localhost:5000/api';
    } else {
        return `${window.location.protocol}//${window.location.host}/api`;
    }
})();

console.log('🔗 API Base URL:', API_BASE_URL);

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise} Response from server
 */
async function registerUser(userData) {
    try {
        console.log('📤 Registering user:', userData.email);
        
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

        console.log('📥 Registration response status:', response.status);
        
        const data = await response.json();
        console.log('📥 Registration response data:', data);

        if (!response.ok) {
            throw new Error(data.message || 'Registration failed');
        }

        return data;
    } catch (error) {
        console.error('❌ Registration error:', error);
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
        console.log('📤 Logging in user:', email);
        
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

        console.log('📥 Login response status:', response.status);
        
        const data = await response.json();
        console.log('📥 Login response data:', data);

        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }

        return data;
    } catch (error) {
        console.error('❌ Login error:', error);
        throw error;
    }
}

/**
 * Store JWT token in localStorage
 * @param {string} token - JWT token
 */
function storeJWTToken(token) {
    localStorage.setItem('jwt_token', token);
    console.log('✅ JWT token stored');
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
    const token = getJWTToken();
    console.log('🔐 Authentication check:', !!token);
    return !!token;
}

/**
 * Logout user
 */
function logoutUser() {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userCountry');
    localStorage.removeItem('assignedTeam');
    localStorage.removeItem('predictions');
    localStorage.removeItem('predictionState');
    console.log('✅ User logged out');
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

/**
 * Health check - verify backend is running
 * @returns {Promise} Response from server
 */
async function healthCheck() {
    try {
        console.log('🏥 Performing health check...');
        
        const response = await fetch(`${API_BASE_URL}/health`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const data = await response.json();
        console.log('✅ Health check passed:', data);
        return data;
    } catch (error) {
        console.error('❌ Health check failed:', error);
        throw error;
    }
}

// Perform health check on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 App initialized, checking backend health...');
    healthCheck().catch(error => {
        console.warn('⚠️ Backend health check failed:', error.message);
    });
});