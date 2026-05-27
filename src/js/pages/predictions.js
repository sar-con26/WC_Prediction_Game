// Score Predictions Page

function createPredictionsPage() {
    return `
        <button class="back-button" onclick="showPage('homePage')">
            <i class="fas fa-arrow-left"></i> Back to Home
        </button>

        <div class="header">
            <div class="header-logo">
                <img src="https://www.deloitte.com/content/dam/assets-shared/logos/svg/a-d/deloitte.svg" alt="Deloitte">
            </div>
            <div class="header-title">
                <h1>Score Predictions</h1>
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

        <div class="matches-container">
            <div class="page-title fadeInUp">
                <h1>Upcoming Matches</h1>
                <p>Make your score predictions for the following matches</p>
            </div>

            <!-- Match 1 -->
            <div class="match-card fadeInUp">
                <div class="match-header">
                    <div class="match-title">Brazil vs Morocco</div>
                    <div class="match-date">Quarter Final • June 15, 2026 • 20:00</div>
                </div>
                <div class="match-prediction">
                    <div class="team-section">
                        <div class="team-flag">🇧🇷</div>
                        <div class="team-name">Brazil</div>
                        <input type="number" class="score-input" id="brazil-score" value="3" min="0" max="20">
                        <div class="score-controls">
                            <button class="score-btn" onclick="decrementScore('brazil-score')">
                                <i class="fas fa-minus"></i>
                            </button>
                            <button class="score-btn" onclick="incrementScore('brazil-score')">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="vs-divider">VS</div>
                    
                    <div class="team-section">
                        <div class="team-flag">🇲🇦</div>
                        <div class="team-name">Morocco</div>
                        <input type="number" class="score-input" id="morocco-score" value="1" min="0" max="20">
                        <div class="score-controls">
                            <button class="score-btn" onclick="decrementScore('morocco-score')">
                                <i class="fas fa-minus"></i>
                            </button>
                            <button class="score-btn" onclick="incrementScore('morocco-score')">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Match 2 -->
            <div class="match-card fadeInUp">
                <div class="match-header">
                    <div class="match-title">Spain vs Germany</div>
                    <div class="match-date">Quarter Final • June 16, 2026 • 18:00</div>
                </div>
                <div class="match-prediction">
                    <div class="team-section">
                        <div class="team-flag">🇪🇸</div>
                        <div class="team-name">Spain</div>
                        <input type="number" class="score-input" id="spain-score" value="2" min="0" max="20">
                        <div class="score-controls">
                            <button class="score-btn" onclick="decrementScore('spain-score')">
                                <i class="fas fa-minus"></i>
                            </button>
                            <button class="score-btn" onclick="incrementScore('spain-score')">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="vs-divider">VS</div>
                    
                    <div class="team-section">
                        <div class="team-flag">🇩🇪</div>
                        <div class="team-name">Germany</div>
                        <input type="number" class="score-input" id="germany-score" value="2" min="0" max="20">
                        <div class="score-controls">
                            <button class="score-btn" onclick="decrementScore('germany-score')">
                                <i class="fas fa-minus"></i>
                            </button>
                            <button class="score-btn" onclick="incrementScore('germany-score')">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Match 3 -->
            <div class="match-card fadeInUp">
                <div class="match-header">
                    <div class="match-title">Argentina vs France</div>
                    <div class="match-date">Semi Final • June 20, 2026 • 20:00</div>
                </div>
                <div class="match-prediction">
                    <div class="team-section">
                        <div class="team-flag">🇦🇷</div>
                        <div class="team-name">Argentina</div>
                        <input type="number" class="score-input" id="argentina-score" value="1" min="0" max="20">
                        <div class="score-controls">
                            <button class="score-btn" onclick="decrementScore('argentina-score')">
                                <i class="fas fa-minus"></i>
                            </button>
                            <button class="score-btn" onclick="incrementScore('argentina-score')">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="vs-divider">VS</div>
                    
                    <div class="team-section">
                        <div class="team-flag">🇫🇷</div>
                        <div class="team-name">France</div>
                        <input type="number" class="score-input" id="france-score" value="0" min="0" max="20">
                        <div class="score-controls">
                            <button class="score-btn" onclick="decrementScore('france-score')">
                                <i class="fas fa-minus"></i>
                            </button>
                            <button class="score-btn" onclick="incrementScore('france-score')">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="submit-section fadeInUp">
                <button class="btn btn-primary" onclick="submitPredictions()" style="max-width: 400px; margin: 0 auto;">
                    <i class="fas fa-check-circle"></i> Submit All Predictions
                </button>
            </div>
        </div>
    `;
}

