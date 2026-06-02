// api.js
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

/**
 * Get user leaderboard
 * @param {number} limit - Number of users to return (default 10, max 100)
 * @returns {Promise} Leaderboard data
 */
async function getUserLeaderboard(limit = 10) {
    try {
        console.log('Fetching user leaderboard with limit:', limit);
        
        const response = await fetch(`${API_BASE_URL}/leaderboard`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'get_user_leaderboard',
                limit: limit
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch user leaderboard');
        }

        console.log('User leaderboard response:', data);
        return data;
    } catch (error) {
        console.error('User leaderboard error:', error);
        throw error;
    }
}

/**
 * Get team leaderboard
 * @returns {Promise} Team leaderboard data
 */
async function getTeamLeaderboard() {
    try {
        console.log('Fetching team leaderboard');
        
        const response = await fetch(`${API_BASE_URL}/leaderboard`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'get_team_leaderboard'
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch team leaderboard');
        }

        console.log('Team leaderboard response:', data);
        return data;
    } catch (error) {
        console.error('Team leaderboard error:', error);
        throw error;
    }
}

/**
 * Get regional comparison (Dublin vs Cork)
 * @returns {Promise} Regional comparison data
 */
async function getRegionalComparison() {
    try {
        console.log('Fetching regional comparison');
        
        const response = await fetch(`${API_BASE_URL}/leaderboard`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'get_regional_comparison'
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch regional comparison');
        }

        console.log('Regional comparison response:', data);
        return data;
    } catch (error) {
        console.error('Regional comparison error:', error);
        throw error;
    }
}

/**
 * Get user statistics
 * @param {number} userId - User ID
 * @param {string} jwtToken - JWT token
 * @returns {Promise} User statistics
 */
async function getUserStats(userId, jwtToken) {
    try {
        console.log('Fetching user stats for user:', userId);
        
        const response = await fetch(`${API_BASE_URL}/leaderboard`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'get_user_stats',
                user_id: userId,
                jwt_token: jwtToken
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch user stats');
        }

        console.log('User stats response:', data);
        return data;
    } catch (error) {
        console.error('User stats error:', error);
        throw error;
    }
}