// Homepage

function createHomePage() {
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
                <span>Your Team: Spain</span>
            </div>
        </div>

        <div class="my-points-card fadeInUp">
            <div class="my-points-stats">
                <div class="points-stat">
                    <div class="points-stat-label">My Points</div>
                    <div class="points-stat-value">598</div>
                </div>
                <div class="points-stat">
                    <div class="points-stat-label">Position</div>
                    <div class="position-value">15th</div>
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
                <ul class="leaderboard-list">
                    <li class="leaderboard-item">
                        <span class="leaderboard-rank">1</span>
                        <span>Fawaz Bakinson</span>
                        <span class="leaderboard-score">847</span>
                    </li>
                    <li class="leaderboard-item">
                        <span class="leaderboard-rank">2</span>
                        <span>Katelyn Hyde</span>
                        <span class="leaderboard-score">823</span>
                    </li>
                    <li class="leaderboard-item">
                        <span class="leaderboard-rank">3</span>
                        <span>Manuel Mastrominico</span>
                        <span class="leaderboard-score">791</span>
                    </li>
                    <li class="leaderboard-item">
                        <span class="leaderboard-rank">4</span>
                        <span>Bhavya Sharma</span>
                        <span class="leaderboard-score">742</span>
                    </li>
                    <li class="leaderboard-item">
                        <span class="leaderboard-rank">5</span>
                        <span>Eoin Comerford</span>
                        <span class="leaderboard-score">718</span>
                    </li>
                    <li class="leaderboard-item">
                        <span class="leaderboard-rank">6</span>
                        <span>David Buckley</span>
                        <span class="leaderboard-score">695</span>
                    </li>
                    <li class="leaderboard-item">
                        <span class="leaderboard-rank">7</span>
                        <span>Anita O'Driscoll</span>
                        <span class="leaderboard-score">672</span>
                    </li>
                    <li class="leaderboard-item">
                        <span class="leaderboard-rank">8</span>
                        <span>James Murphy</span>
                        <span class="leaderboard-score">658</span>
                    </li>
                    <li class="leaderboard-item">
                        <span class="leaderboard-rank">9</span>
                        <span>Emma Walsh</span>
                        <span class="leaderboard-score">645</span>
                    </li>
                    <li class="leaderboard-item">
                        <span class="leaderboard-rank">10</span>
                        <span>Liam O'Brien</span>
                        <span class="leaderboard-score">632</span>
                    </li>
                </ul>
                <div style="margin: 20px 0; text-align: center; color: rgba(255, 255, 255, 0.5); font-size: 1rem; letter-spacing: 8px;">• • •</div>
                <div style="margin-bottom: 10px; padding-left: 12px; color: rgba(255, 255, 255, 0.6); font-size: 0.85rem; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Your Position:</div>
                <ul class="leaderboard-list">
                    <li class="leaderboard-item user-highlight">
                        <span class="leaderboard-rank">15</span>
                        <span>Sarah Connolly <span class="user-badge">YOU</span></span>
                        <span class="leaderboard-score" style="background: linear-gradient(135deg, #FF8C00, #FFA500);">598</span>
                    </li>
                </ul>
            </div>

            <div class="content-card fadeInUp">
                <h3 class="card-title">
                    <i class="fas fa-trophy"></i> Sweepstake Team Success
                </h3>
                <p style="color: rgba(255, 255, 255, 0.7); margin-bottom: 15px; font-size: 0.9rem;">Teams ranked by tournament performance</p>
                <ul class="leaderboard-list">
                    <li class="leaderboard-item" style="flex-direction: column; align-items: flex-start; gap: 8px;">
                        <div style="display: flex; justify-content: space-between; width: 100%; align-items: center;">
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <span class="leaderboard-rank">1</span>
                                <span>🇧🇷 Brazil</span>
                            </div>
                            <span class="leaderboard-score">9 pts</span>
                        </div>
                        <div class="team-stats">
                            <span class="stat-item"><i class="fas fa-check-circle" style="color: #86BC25;"></i> 3W</span>
                            <span class="stat-item"><i class="fas fa-minus-circle" style="color: #F59E0B;"></i> 0D</span>
                            <span class="stat-item"><i class="fas fa-times-circle" style="color: #EF4444;"></i> 0L</span>
                            <span class="stat-item"><i class="fas fa-futbol"></i> +7 GD</span>
                        </div>
                    </li>
                    <li class="leaderboard-item" style="flex-direction: column; align-items: flex-start; gap: 8px;">
                        <div style="display: flex; justify-content: space-between; width: 100%; align-items: center;">
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <span class="leaderboard-rank">2</span>
                                <span>🇪🇸 Spain</span>
                            </div>
                            <span class="leaderboard-score">7 pts</span>
                        </div>
                        <div class="team-stats">
                            <span class="stat-item"><i class="fas fa-check-circle" style="color: #86BC25;"></i> 2W</span>
                            <span class="stat-item"><i class="fas fa-minus-circle" style="color: #F59E0B;"></i> 1D</span>
                            <span class="stat-item"><i class="fas fa-times-circle" style="color: #EF4444;"></i> 0L</span>
                            <span class="stat-item"><i class="fas fa-futbol"></i> +5 GD</span>
                        </div>
                    </li>
                    <li class="leaderboard-item" style="flex-direction: column; align-items: flex-start; gap: 8px;">
                        <div style="display: flex; justify-content: space-between; width: 100%; align-items: center;">
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <span class="leaderboard-rank">3</span>
                                <span>🇦🇷 Argentina</span>
                            </div>
                            <span class="leaderboard-score">7 pts</span>
                        </div>
                        <div class="team-stats">
                            <span class="stat-item"><i class="fas fa-check-circle" style="color: #86BC25;"></i> 2W</span>
                            <span class="stat-item"><i class="fas fa-minus-circle" style="color: #F59E0B;"></i> 1D</span>
                            <span class="stat-item"><i class="fas fa-times-circle" style="color: #EF4444;"></i> 0L</span>
                            <span class="stat-item"><i class="fas fa-futbol"></i> +4 GD</span>
                        </div>
                    </li>
                    <li class="leaderboard-item" style="flex-direction: column; align-items: flex-start; gap: 8px;">
                        <div style="display: flex; justify-content: space-between; width: 100%; align-items: center;">
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <span class="leaderboard-rank">4</span>
                                <span>🇫🇷 France</span>
                            </div>
                            <span class="leaderboard-score">6 pts</span>
                        </div>
                        <div class="team-stats">
                            <span class="stat-item"><i class="fas fa-check-circle" style="color: #86BC25;"></i> 2W</span>
                            <span class="stat-item"><i class="fas fa-minus-circle" style="color: #F59E0B;"></i> 0D</span>
                            <span class="stat-item"><i class="fas fa-times-circle" style="color: #EF4444;"></i> 1L</span>
                            <span class="stat-item"><i class="fas fa-futbol"></i> +3 GD</span>
                        </div>
                    </li>
                    <li class="leaderboard-item" style="flex-direction: column; align-items: flex-start; gap: 8px;">
                        <div style="display: flex; justify-content: space-between; width: 100%; align-items: center;">
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <span class="leaderboard-rank">5</span>
                                <span>🇩🇪 Germany</span>
                            </div>
                            <span class="leaderboard-score">6 pts</span>
                        </div>
                        <div class="team-stats">
                            <span class="stat-item"><i class="fas fa-check-circle" style="color: #86BC25;"></i> 2W</span>
                            <span class="stat-item"><i class="fas fa-minus-circle" style="color: #F59E0B;"></i> 0D</span>
                            <span class="stat-item"><i class="fas fa-times-circle" style="color: #EF4444;"></i> 1L</span>
                            <span class="stat-item"><i class="fas fa-futbol"></i> +2 GD</span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>

        <div class="content-card" style="grid-column: 1 / -1;">
            <h3 class="card-title">
                <i class="fas fa-chart-bar"></i> Dublin vs Cork
            </h3>
            <p style="color: rgba(255, 255, 255, 0.7); margin-bottom: 15px;">Regional Competition Standings</p>
            <div class="chart-placeholder">
                <div class="chart-bars">
                    <div class="chart-bar">
                        <div class="bar barGrow" style="height: 120px;">
                            <span class="bar-value">847</span>
                        </div>
                        <span class="bar-label">Dublin</span>
                    </div>
                    <div class="chart-bar">
                        <div class="bar barGrow" style="height: 90px;">
                            <span class="bar-value">623</span>
                        </div>
                        <span class="bar-label">Cork</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}