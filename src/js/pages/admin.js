
// Admin Section

// List of admin emails
const ADMIN_EMAILS = [
    'admin@deloitte.ie',
    'admin@deloitte.com',
    'aodriscoll@deloitte.ie'
];

// Check if user is admin
function isUserAdmin() {
    // TEMPORARILY ALLOW EVERYONE FOR TESTING
    return true;
    
    // ORIGINAL CODE (uncomment to re-enable email check):
    // const userEmail = localStorage.getItem('userEmail') || '';
    // return ADMIN_EMAILS.includes(userEmail.toLowerCase());
}

// Create Admin Page
function createAdminPage() {
    // Check if user is admin
    if (!isUserAdmin()) {
        return `
            <div class="admin-access-denied fadeInUp">
                <div class="access-denied-content">
                    <i class="fas fa-lock" style="font-size: 4rem; color: #EF4444; margin-bottom: 20px;"></i>
                    <h2>Access Denied</h2>
                    <p>You do not have permission to access the admin section.</p>
                    <p style="font-size: 0.9rem; color: rgba(255, 255, 255, 0.6); margin-top: 10px;">
                        Contact your administrator if you believe this is an error.
                    </p>
                    <button class="btn btn-primary" onclick="showPage('homePage')" style="margin-top: 20px;">
                        <i class="fas fa-arrow-left"></i> Back to Home
                    </button>
                </div>
            </div>
        `;
    }

    return `
        <button class="back-button" onclick="showPage('homePage')">
            <i class="fas fa-arrow-left"></i> Back to Home
        </button>

        <div class="admin-header">
            <div class="admin-title">
                <i class="fas fa-shield-alt"></i>
                <h1>Admin Dashboard</h1>
            </div>
            <div class="admin-user-info">
                <span>${localStorage.getItem('userEmail')}</span>
                <span class="admin-badge">ADMIN</span>
            </div>
        </div>

        <!-- Admin Tabs -->
        <div class="admin-tabs">
            <button class="admin-tab-btn active" onclick="switchAdminTab('match-scores')">
                <i class="fas fa-futbol"></i> Match Scores
            </button>
            <button class="admin-tab-btn" onclick="switchAdminTab('users')">
                <i class="fas fa-users"></i> Users
            </button>
            <button class="admin-tab-btn" onclick="switchAdminTab('predictions')">
                <i class="fas fa-chart-bar"></i> Predictions
            </button>
            <button class="admin-tab-btn" onclick="switchAdminTab('leaderboard')">
                <i class="fas fa-trophy"></i> Leaderboard
            </button>
        </div>

        <!-- Match Scores Tab -->
        <div id="match-scores" class="admin-tab-content active">
            <div class="admin-card">
                <h2><i class="fas fa-futbol"></i> Match Score Entry</h2>
                <p class="admin-subtitle">Enter actual match scores to update leaderboards</p>
                
                <div class="match-entry-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="match-select">Select Match</label>
                            <select id="match-select" class="form-input">
                                <option value="">-- Select a match --</option>
                                <option value="1">Brazil vs Morocco - June 15, 2026</option>
                                <option value="2">Spain vs Germany - June 16, 2026</option>
                                <option value="3">Argentina vs France - June 20, 2026</option>
                                <option value="4">England vs Netherlands - June 21, 2026</option>
                                <option value="5">Belgium vs Portugal - June 22, 2026</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="team1-score">Team 1 Score</label>
                            <input type="number" id="team1-score" class="form-input" placeholder="0" min="0" max="20">
                        </div>
                        <div class="form-group">
                            <label for="team2-score">Team 2 Score</label>
                            <input type="number" id="team2-score" class="form-input" placeholder="0" min="0" max="20">
                        </div>
                    </div>

                    <button class="admin-button" onclick="submitMatchScore()">
                        <i class="fas fa-check"></i> Submit Score
                    </button>
                </div>

                <h3>Match Results</h3>
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Match</th>
                            <th>Date</th>
                            <th>Score</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Brazil vs Morocco</td>
                            <td>June 15, 2026</td>
                            <td><span class="score-badge">3 - 1</span></td>
                            <td><span class="status-badge completed">Completed</span></td>
                            <td><button class="btn-small"><i class="fas fa-edit"></i> Edit</button></td>
                        </tr>
                        <tr>
                            <td>Spain vs Germany</td>
                            <td>June 16, 2026</td>
                            <td><span class="score-badge">2 - 2</span></td>
                            <td><span class="status-badge completed">Completed</span></td>
                            <td><button class="btn-small"><i class="fas fa-edit"></i> Edit</button></td>
                        </tr>
                        <tr>
                            <td>Argentina vs France</td>
                            <td>June 20, 2026</td>
                            <td>-</td>
                            <td><span class="status-badge pending">Pending</span></td>
                            <td><button class="btn-small"><i class="fas fa-edit"></i> Edit</button></td>
                        </tr>
                        <tr>
                            <td>England vs Netherlands</td>
                            <td>June 21, 2026</td>
                            <td>-</td>
                            <td><span class="status-badge pending">Pending</span></td>
                            <td><button class="btn-small"><i class="fas fa-edit"></i> Edit</button></td>
                        </tr>
                        <tr>
                            <td>Belgium vs Portugal</td>
                            <td>June 22, 2026</td>
                            <td>-</td>
                            <td><span class="status-badge pending">Pending</span></td>
                            <td><button class="btn-small"><i class="fas fa-edit"></i> Edit</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Users Tab -->
        <div id="users" class="admin-tab-content">
            <div class="admin-card">
                <h2><i class="fas fa-users"></i> User Management</h2>
                <p class="admin-subtitle">View and manage registered users</p>
                
                <div class="search-box">
                    <input type="text" class="form-input" placeholder="Search users by name or email...">
                </div>

                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Assigned Team</th>
                            <th>Registration Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Sarah Connolly</td>
                            <td>sarah.connolly@deloitte.ie</td>
                            <td>🇪🇸 Spain</td>
                            <td>May 20, 2026</td>
                            <td><span class="status-badge active">Active</span></td>
                            <td><button class="btn-small"><i class="fas fa-eye"></i> View</button></td>
                        </tr>
                        <tr>
                            <td>Fawaz Bakinson</td>
                            <td>fawaz.bakinson@deloitte.ie</td>
                            <td>🇧🇷 Brazil</td>
                            <td>May 19, 2026</td>
                            <td><span class="status-badge active">Active</span></td>
                            <td><button class="btn-small"><i class="fas fa-eye"></i> View</button></td>
                        </tr>
                        <tr>
                            <td>Katelyn Hyde</td>
                            <td>katelyn.hyde@deloitte.ie</td>
                            <td>🇫🇷 France</td>
                            <td>May 18, 2026</td>
                            <td><span class="status-badge active">Active</span></td>
                            <td><button class="btn-small"><i class="fas fa-eye"></i> View</button></td>
                        </tr>
                        <tr>
                            <td>Manuel Mastrominico</td>
                            <td>manuel.mastrominico@deloitte.ie</td>
                            <td>🇦🇷 Argentina</td>
                            <td>May 17, 2026</td>
                            <td><span class="status-badge active">Active</span></td>
                            <td><button class="btn-small"><i class="fas fa-eye"></i> View</button></td>
                        </tr>
                        <tr>
                            <td>Bhavya Sharma</td>
                            <td>bhavya.sharma@deloitte.ie</td>
                            <td>🇩🇪 Germany</td>
                            <td>May 16, 2026</td>
                            <td><span class="status-badge active">Active</span></td>
                            <td><button class="btn-small"><i class="fas fa-eye"></i> View</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Predictions Tab -->
        <div id="predictions" class="admin-tab-content">
            <div class="admin-card">
                <h2><i class="fas fa-chart-bar"></i> User Predictions</h2>
                <p class="admin-subtitle">View all user predictions and accuracy</p>
                
                <div class="filter-box">
                    <select class="form-input" style="width: 100%; max-width: 300px;">
                        <option value="">-- All Predictions --</option>
                        <option value="tournament">Tournament Winner</option>
                        <option value="boot">Golden Boot</option>
                        <option value="glove">Golden Glove</option>
                        <option value="match">Match Scores</option>
                    </select>
                </div>

                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Prediction Type</th>
                            <th>Prediction</th>
                            <th>Actual Result</th>
                            <th>Points</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Sarah Connolly</td>
                            <td><span class="badge-type tournament">Tournament</span></td>
                            <td>Brazil</td>
                            <td>Brazil</td>
                            <td><span class="points-badge correct">+10</span></td>
                            <td>May 20, 2026</td>
                        </tr>
                        <tr>
                            <td>Fawaz Bakinson</td>
                            <td><span class="badge-type boot">Golden Boot</span></td>
                            <td>Kylian Mbappé</td>
                            <td>Kylian Mbappé</td>
                            <td><span class="points-badge correct">+8</span></td>
                            <td>May 19, 2026</td>
                        </tr>
                        <tr>
                            <td>Katelyn Hyde</td>
                            <td><span class="badge-type match">Match Score</span></td>
                            <td>Brazil 3-1 Morocco</td>
                            <td>Brazil 3-1 Morocco</td>
                            <td><span class="points-badge correct">+5</span></td>
                            <td>May 18, 2026</td>
                        </tr>
                        <tr>
                            <td>Manuel Mastrominico</td>
                            <td><span class="badge-type glove">Golden Glove</span></td>
                            <td>Gianluigi Donnarumma</td>
                            <td>Alisson</td>
                            <td><span class="points-badge">0</span></td>
                            <td>May 17, 2026</td>
                        </tr>
                        <tr>
                            <td>Bhavya Sharma</td>
                            <td><span class="badge-type match">Match Score</span></td>
                            <td>Spain 2-2 Germany</td>
                            <td>Spain 2-2 Germany</td>
                            <td><span class="points-badge correct">+5</span></td>
                            <td>May 16, 2026</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Leaderboard Tab -->
        <div id="leaderboard" class="admin-tab-content">
            <div class="admin-card">
                <h2><i class="fas fa-trophy"></i> Leaderboard Management</h2>
                <p class="admin-subtitle">Manage and recalculate leaderboards</p>
                
                <div class="leaderboard-actions">
                    <button class="admin-button" onclick="recalculateLeaderboard()">
                        <i class="fas fa-sync"></i> Recalculate Leaderboard
                    </button>
                    <button class="admin-button" style="background: linear-gradient(135deg, #EF4444, #dc2626);" onclick="resetAllPoints()">
                        <i class="fas fa-exclamation-triangle"></i> Reset All Points
                    </button>
                </div>

                <div class="leaderboard-info">
                    <div class="info-card">
                        <h4>Total Users</h4>
                        <p>47</p>
                    </div>
                    <div class="info-card">
                        <h4>Total Predictions</h4>
                        <p>234</p>
                    </div>
                    <div class="info-card">
                        <h4>Completed Matches</h4>
                        <p>2</p>
                    </div>
                    <div class="info-card">
                        <h4>Last Updated</h4>
                        <p>Just now</p>
                    </div>
                </div>

                <h3>Top 10 Users</h3>
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>User</th>
                            <th>Team</th>
                            <th>Points</th>
                            <th>Predictions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>Fawaz Bakinson</td>
                            <td>🇧🇷 Brazil</td>
                            <td><span class="score-badge">847</span></td>
                            <td>42</td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>Katelyn Hyde</td>
                            <td>🇫🇷 France</td>
                            <td><span class="score-badge">823</span></td>
                            <td>41</td>
                        </tr>
                        <tr>
                            <td>3</td>
                            <td>Manuel Mastrominico</td>
                            <td>🇦🇷 Argentina</td>
                            <td><span class="score-badge">791</span></td>
                            <td>39</td>
                        </tr>
                        <tr>
                            <td>4</td>
                            <td>Bhavya Sharma</td>
                            <td>🇩🇪 Germany</td>
                            <td><span class="score-badge">742</span></td>
                            <td>37</td>
                        </tr>
                        <tr>
                            <td>5</td>
                            <td>Sarah Connolly</td>
                            <td>🇪🇸 Spain</td>
                            <td><span class="score-badge">718</span></td>
                            <td>36</td>
                        </tr>
                        <tr>
                            <td>6</td>
                            <td>David Buckley</td>
                            <td>🇬🇧 England</td>
                            <td><span class="score-badge">695</span></td>
                            <td>35</td>
                        </tr>
                        <tr>
                            <td>7</td>
                            <td>Anita O'Driscoll</td>
                            <td>🇳🇱 Netherlands</td>
                            <td><span class="score-badge">672</span></td>
                            <td>34</td>
                        </tr>
                        <tr>
                            <td>8</td>
                            <td>James Murphy</td>
                            <td>🇵🇹 Portugal</td>
                            <td><span class="score-badge">658</span></td>
                            <td>33</td>
                        </tr>
                        <tr>
                            <td>9</td>
                            <td>Emma Walsh</td>
                            <td>🇩🇪 Germany</td>
                            <td><span class="score-badge">645</span></td>
                            <td>32</td>
                        </tr>
                        <tr>
                            <td>10</td>
                            <td>Liam O'Brien</td>
                            <td>🇦🇹 Austria</td>
                            <td><span class="score-badge">632</span></td>
                            <td>31</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// Switch between admin tabs
function switchAdminTab(tabName) {
    // Hide all tabs
    const tabs = document.querySelectorAll('.admin-tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // Remove active class from all buttons
    const buttons = document.querySelectorAll('.admin-tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    // Show selected tab
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // Add active class to clicked button
    event.target.closest('.admin-tab-btn').classList.add('active');
}

// Submit match score
function submitMatchScore() {
    const matchSelect = document.getElementById('match-select').value;
    const team1Score = document.getElementById('team1-score').value;
    const team2Score = document.getElementById('team2-score').value;
    
    if (!matchSelect || team1Score === '' || team2Score === '') {
        alert('Please fill in all fields');
        return;
    }
    
    alert(`Score submitted: ${team1Score} - ${team2Score}`);
    // Here you would send the data to your backend
}

// Recalculate leaderboard
function recalculateLeaderboard() {
    alert('Leaderboard recalculated! All user points have been updated.');
    // Here you would call your backend API to recalculate
}

// Reset all points
function resetAllPoints() {
    if (confirm('⚠️ WARNING: This will reset ALL user points to 0. This cannot be undone. Are you sure?')) {
        alert('All points have been reset to 0.');
        // Here you would call your backend API to reset points
    }
}