// Homepage with Dynamic Leaderboards - FIXED VERSION
// - Team leaderboard now shows W/D/L instead of points
// - Position now shows correctly (no more N/A)

// Store leaderboard data globally
let userLeaderboardData = [];
let teamLeaderboardData = [];
let regionalComparisonData = [];

function createHomePage() {
    // Get the assigned team from localStorage
    const assignedTeam = JSON.parse(localStorage.getItem('assignedTeam') || '{}');
    const teamDisplay = assignedTeam.flag && assignedTeam.name 
        ? `${assignedTeam.flag} ${assignedTeam.name}` 
        : 'Your Team';
    
    return `
        <button class="back-button" onclick="showPage('loginPage')">
            <i class="fas fa-arrow-left"></i> Back to Login
        </button>

        <div class="header">
            <div class="header-logo">
                <img src="https://www.deloitte.com/content/dam/assets-shared/logos/svg/a-d/deloitte.svg" alt="Deloitte">
            </div>
            <div class="header-title">
                <h1>World Cup Predictor</h1>
            </div>
            <div class="header-user">
                <i class="fas fa-flag"></i>
                <span>${teamDisplay}</span>
            </div>
            <div class="header-admin">
                <button class="admin-link" onclick="showPage('adminPage')" title="Admin Panel">
                    <i class="fas fa-shield-alt"></i>
                </button>
            </div>
        </div>

        <div class="my-points-card fadeInUp">
            <div class="my-points-stats">
                <div class="points-stat">
                    <div class="points-stat-label">My Points</div>
                    <div class="points-stat-value" id="myPointsDisplay">0</div>
                </div>
                <div class="points-stat">
                    <div class="points-stat-label">Position</div>
                    <div class="position-value" id="myPositionDisplay">-</div>
                </div>
            </div>
            <button class="btn-history" onclick="openHistory()">
                <i class="fas fa-history"></i> My History
            </button>
        </div>

        <div class="cta-section">
            <h2><i class="fas fa-futbol"></i> Ready to Make Your Predictions?</h2>
            <p>Upcoming matches are waiting for your expert predictions!</p>
            <button class="btn btn-primary" onclick="showPage('scoreGuesserPage')" style="max-width: 300px; margin: 0 auto;">
                <i class="fas fa-edit"></i> Guess the Score
            </button>
        </div>

        <div class="content-grid">
            <div class="content-card fadeInUp">
                <h3 class="card-title">
                    <i class="fas fa-bullseye"></i> Prediction Accuracy Leaderboard
                </h3>
                <p style="color: rgba(255, 255, 255, 0.7); margin-bottom: 15px; font-size: 0.9rem;">Top users by prediction points</p>
                <div id="userLeaderboardContainer" style="min-height: 400px;">
                    <div style="text-align: center; padding: 20px; color: rgba(255, 255, 255, 0.6);">
                        <i class="fas fa-spinner fa-spin"></i> Loading leaderboard...
                    </div>
                </div>
            </div>

            <div class="content-card fadeInUp">
                <h3 class="card-title">
                    <i class="fas fa-trophy"></i> Sweepstake Team Success
                </h3>
                <p style="color: rgba(255, 255, 255, 0.7); margin-bottom: 15px; font-size: 0.9rem;">Teams ranked by tournament performance</p>
                <div id="teamLeaderboardContainer" style="min-height: 400px;">
                    <div style="text-align: center; padding: 20px; color: rgba(255, 255, 255, 0.6);">
                        <i class="fas fa-spinner fa-spin"></i> Loading leaderboard...
                    </div>
                </div>
            </div>
        </div>

        <div class="content-card" style="grid-column: 1 / -1;">
            <h3 class="card-title">
                <i class="fas fa-chart-bar"></i> Dublin vs Cork
            </h3>
            <p style="color: rgba(255, 255, 255, 0.7); margin-bottom: 15px;">Regional Competition Standings</p>
            <div id="regionalComparisonContainer" style="min-height: 200px;">
                <div style="text-align: center; padding: 20px; color: rgba(255, 255, 255, 0.6);">
                    <i class="fas fa-spinner fa-spin"></i> Loading regional data...
                </div>
            </div>
        </div>
    `;
}

// Load leaderboards when home page is shown
async function loadLeaderboards() {
    try {
        console.log('Loading leaderboards...');
        
        // Load all leaderboards in parallel
        const [userLeaderboard, teamLeaderboard, regionalComparison] = await Promise.all([
            getUserLeaderboard(10),
            getTeamLeaderboard(),
            getRegionalComparison()
        ]);
        
        // Store data globally
        userLeaderboardData = userLeaderboard.leaderboard || [];
        teamLeaderboardData = teamLeaderboard.leaderboard || [];
        regionalComparisonData = regionalComparison.regions || [];
        
        // Render leaderboards
        renderUserLeaderboard();
        renderTeamLeaderboard();
        renderRegionalComparison();
        
        // Update my points and position
        updateMyStats();
        
        console.log('Leaderboards loaded successfully');
    } catch (error) {
        console.error('Error loading leaderboards:', error);
        
        // Show error messages
        const userContainer = document.getElementById('userLeaderboardContainer');
        const teamContainer = document.getElementById('teamLeaderboardContainer');
        const regionalContainer = document.getElementById('regionalComparisonContainer');
        
        if (userContainer) {
            userContainer.innerHTML = `<div style="text-align: center; padding: 20px; color: #EF4444;">Error loading user leaderboard</div>`;
        }
        if (teamContainer) {
            teamContainer.innerHTML = `<div style="text-align: center; padding: 20px; color: #EF4444;">Error loading team leaderboard</div>`;
        }
        if (regionalContainer) {
            regionalContainer.innerHTML = `<div style="text-align: center; padding: 20px; color: #EF4444;">Error loading regional data</div>`;
        }
    }
}

// Update my stats in the header
function updateMyStats() {
    const userId = parseInt(localStorage.getItem('userId'));
    
    if (!userId) return;
    
    // Find user in leaderboard
    const user = userLeaderboardData.find(u => u.user_id === userId);
    
    // Update points display
    const pointsDisplay = document.getElementById('myPointsDisplay');
    if (pointsDisplay) {
        pointsDisplay.textContent = user ? user.total_points : 0;
    }
    
    // Update position display
    const positionDisplay = document.getElementById('myPositionDisplay');
    if (positionDisplay) {
        if (user) {
            positionDisplay.textContent = getOrdinalSuffix(user.rank);
        } else {
            positionDisplay.textContent = 'Not Ranked';
        }
    }
}

// Render user leaderboard
function renderUserLeaderboard() {
    const container = document.getElementById('userLeaderboardContainer');
    if (!container) return;
    
    if (userLeaderboardData.length === 0) {
        container.innerHTML = '<div style="text-align: center; padding: 20px; color: rgba(255, 255, 255, 0.6);">No leaderboard data available</div>';
        return;
    }
    
    let html = '<ul class="leaderboard-list">';
    
    userLeaderboardData.forEach(user => {
        html += `
            <li class="leaderboard-item">
                <span class="leaderboard-rank">${user.rank}</span>
                <span>${user.username}</span>
                <span class="leaderboard-score">${user.total_points}</span>
            </li>
        `;
    });
    
    html += '</ul>';
    
    // Add user position if available
    const userId = parseInt(localStorage.getItem('userId'));
    const userName = localStorage.getItem('userName');
    
    if (userId && userName) {
        html += `
            <div style="margin: 20px 0; text-align: center; color: rgba(255, 255, 255, 0.5); font-size: 1rem; letter-spacing: 8px;">• • •</div>
            <div style="margin-bottom: 10px; padding-left: 12px; color: rgba(255, 255, 255, 0.6); font-size: 0.85rem; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Your Position:</div>
            <ul class="leaderboard-list">
                ${generateUserPositionHTML(userLeaderboardData, userId, userName)}
            </ul>
        `;
    }
    
    container.innerHTML = html;
}

// Render team leaderboard - NOW SHOWS W/D/L INSTEAD OF POINTS
function renderTeamLeaderboard() {
    const container = document.getElementById('teamLeaderboardContainer');
    if (!container) return;
    
    if (teamLeaderboardData.length === 0) {
        container.innerHTML = '<div style="text-align: center; padding: 20px; color: rgba(255, 255, 255, 0.6);">No team data available</div>';
        return;
    }
    
    let html = '<ul class="leaderboard-list">';
    
    teamLeaderboardData.forEach(team => {
        // Extract W/D/L from team data if available, otherwise show as TBD
        const wins = team.wins || 0;
        const draws = team.draws || 0;
        const losses = team.losses || 0;
        const goalDifference = team.goal_difference || 0;
        
        html += `
            <li class="leaderboard-item" style="flex-direction: column; align-items: flex-start; gap: 8px;">
                <div style="display: flex; justify-content: space-between; width: 100%; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span class="leaderboard-rank">${team.rank}</span>
                        <span>${team.team}</span>
                    </div>
                    <span class="leaderboard-score">${wins * 3 + draws} pts</span>
                </div>
                <div class="team-stats">
                    <span class="stat-item"><i class="fas fa-check-circle" style="color: #86BC25;"></i> ${wins}W</span>
                    <span class="stat-item"><i class="fas fa-minus-circle" style="color: #F59E0B;"></i> ${draws}D</span>
                    <span class="stat-item"><i class="fas fa-times-circle" style="color: #EF4444;"></i> ${losses}L</span>
                    <span class="stat-item"><i class="fas fa-futbol"></i> ${goalDifference > 0 ? '+' : ''}${goalDifference} GD</span>
                </div>
            </li>
        `;
    });
    
    html += '</ul>';
    container.innerHTML = html;
}

// Render regional comparison
function renderRegionalComparison() {
    const container = document.getElementById('regionalComparisonContainer');
    if (!container) return;
    
    if (regionalComparisonData.length === 0) {
        container.innerHTML = '<div style="text-align: center; padding: 20px; color: rgba(255, 255, 255, 0.6);">No regional data available</div>';
        return;
    }
    
    // Find max points for scaling
    const maxPoints = Math.max(...regionalComparisonData.map(r => r.total_points), 1);
    
    let html = '<div class="chart-placeholder"><div class="chart-bars">';
    
    regionalComparisonData.forEach(region => {
        const heightPercent = (region.total_points / maxPoints) * 100;
        const height = Math.max(heightPercent, 20); // Minimum height for visibility
        
        html += `
            <div class="chart-bar">
                <div class="bar barGrow" style="height: ${height}px;">
                    <span class="bar-value">${region.total_points}</span>
                </div>
                <span class="bar-label">${region.office_location}</span>
                <div style="font-size: 0.8rem; color: rgba(255, 255, 255, 0.6); margin-top: 5px;">
                    ${region.total_users} users
                </div>
            </div>
        `;
    });
    
    html += '</div></div>';
    container.innerHTML = html;
}

// Helper function to convert number to ordinal (1st, 2nd, 3rd, etc.)
function getOrdinalSuffix(num) {
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) return num + 'st';
    if (j === 2 && k !== 12) return num + 'nd';
    if (j === 3 && k !== 13) return num + 'rd';
    return num + 'th';
}

// Helper function to generate user position HTML
function generateUserPositionHTML(leaderboard, userId, userName) {
    const user = leaderboard.find(u => u.user_id === userId);
    
    if (!user) {
        return `
            <li class="leaderboard-item user-highlight">
                <span class="leaderboard-rank">-</span>
                <span>${userName} <span class="user-badge">YOU</span></span>
                <span class="leaderboard-score" style="background: linear-gradient(135deg, #FF8C00, #FFA500);">0</span>
            </li>
        `;
    }
    
    return `
        <li class="leaderboard-item user-highlight">
            <span class="leaderboard-rank">${user.rank}</span>
            <span>${userName} <span class="user-badge">YOU</span></span>
            <span class="leaderboard-score" style="background: linear-gradient(135deg, #FF8C00, #FFA500);">${user.total_points}</span>
        </li>
    `;
}

// Open prediction history
function openHistory() {
    alert('📊 Prediction History\n\nYour predictions will be displayed here once you make some!');
}

// Auto-load leaderboards when home page is shown
document.addEventListener('DOMContentLoaded', function() {
    const observer = new MutationObserver(function(mutations) {
        const homePage = document.getElementById('homePage');
        if (homePage && homePage.classList.contains('active')) {
            // Load leaderboards after a short delay to ensure DOM is ready
            setTimeout(loadLeaderboards, 100);
        }
    });
    
    observer.observe(document.body, { subtree: true, attributes: true, attributeFilter: ['class'] });
});