// Score Predictions Page

// Match data - easily add/remove matches here
const MATCHES = [
    {
        id: 1,
        team1: { 
            name: 'Brazil', 
            flag: '🇧🇷' 
        },
        team2: { 
            name: 'Morocco', 
            flag: '🇲🇦' 
        },
        stage: 'Quarter Final',
        date: 'June 15, 2026',
        time: '20:00'
    },
    {
        id: 2,
        team1: { 
            name: 'Spain', 
            flag: '🇪🇸' 
        },
        team2: { 
            name: 'Germany', 
            flag: '🇩🇪' 
        },
        stage: 'Quarter Final',
        date: 'June 16, 2026',
        time: '18:00'
    },
    {
        id: 3,
        team1: { 
            name: 'Argentina', 
            flag: '🇦🇷' 
        },
        team2: { 
            name: 'France', 
            flag: '🇫🇷' 
        },
        stage: 'Semi Final',
        date: 'June 20, 2026',
        time: '20:00'
    },
    {
        id: 4,
        team1: { 
            name: 'England', 
            flag: '🇬🇧' 
        },
        team2: { 
            name: 'Netherlands', 
            flag: '🇳🇱' 
        },
        stage: 'Semi Final',
        date: 'June 21, 2026',
        time: '19:00'
    },
    {
        id: 5,
        team1: { 
            name: 'Belgium', 
            flag: '🇧🇪' 
        },
        team2: { 
            name: 'Portugal', 
            flag: '🇵🇹' 
        },
        stage: 'Quarter Final',
        date: 'June 22, 2026',
        time: '21:00'
    }
];

function createPredictionsPage() {
    // Get current user data
    const userEmail = localStorage.getItem('userEmail') || 'User';
    const userName = localStorage.getItem('userName') || 'User';
    const userTeam = localStorage.getItem('userTeam') || 'Not Selected';
    const userPoints = localStorage.getItem('userPoints') || '0';
    const userPosition = localStorage.getItem('userPosition') || 'N/A';

    // Generate match cards dynamically
    let matchCardsHTML = '';
    MATCHES.forEach(match => {
        const matchKey = `match_${match.id}`;
        const savedPrediction = JSON.parse(
            localStorage.getItem(matchKey) || '{}'
        );
        const team1Score = savedPrediction.team1Score || '0';
        const team2Score = savedPrediction.team2Score || '0';

        matchCardsHTML += `
            <div class="match-card fadeInUp">
                <div class="match-header">
                    <div class="match-title">
                        ${match.team1.name} vs ${match.team2.name}
                    </div>
                    <div class="match-date">
                        ${match.stage} • ${match.date} • ${match.time}
                    </div>
                </div>
                <div class="match-prediction">
                    <div class="team-section">
                        <div class="team-flag">${match.team1.flag}</div>
                        <div class="team-name">${match.team1.name}</div>
                        <input 
                            type="number" 
                            class="score-input" 
                            id="match_${match.id}_team1" 
                            value="${team1Score}" 
                            min="0" 
                            max="20"
                        >
                        <div class="score-controls">
                            <button 
                                class="score-btn" 
                                onclick="decrementScore('match_${match.id}_team1')"
                            >
                                <i class="fas fa-minus"></i>
                            </button>
                            <button 
                                class="score-btn" 
                                onclick="incrementScore('match_${match.id}_team1')"
                            >
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="vs-divider">VS</div>
                    
                    <div class="team-section">
                        <div class="team-flag">${match.team2.flag}</div>
                        <div class="team-name">${match.team2.name}</div>
                        <input 
                            type="number" 
                            class="score-input" 
                            id="match_${match.id}_team2" 
                            value="${team2Score}" 
                            min="0" 
                            max="20"
                        >
                        <div class="score-controls">
                            <button 
                                class="score-btn" 
                                onclick="decrementScore('match_${match.id}_team2')"
                            >
                                <i class="fas fa-minus"></i>
                            </button>
                            <button 
                                class="score-btn" 
                                onclick="incrementScore('match_${match.id}_team2')"
                            >
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    return `
        <button class="back-button" onclick="showPage('homePage')">
            <i class="fas fa-arrow-left"></i> Back to Home
        </button>

        <div class="header">
            <div class="header-logo">
                <img 
                    src="https://www.deloitte.com/content/dam/assets-shared/logos/svg/a-d/deloitte.svg" 
                    alt="Deloitte"
                >
            </div>
            <div class="header-title">
                <h1>Score Predictions</h1>
            </div>
            <div class="header-user">
                <i class="fas fa-flag"></i>
                <span>Your Team: ${userTeam}</span>
            </div>
        </div>

        <div class="my-points-card fadeInUp">
            <div class="my-points-stats">
                <div class="points-stat">
                    <div class="points-stat-label">My Points</div>
                    <div class="points-stat-value">${userPoints}</div>
                </div>
                <div class="points-stat">
                    <div class="points-stat-label">Position</div>
                    <div class="position-value">${userPosition}</div>
                </div>
            </div>
            <button class="btn-history" onclick="openHistory()">
                <i class="fas fa-history"></i> My History
            </button>
        </div>

        <div class="matches-container">
            <div class="page-title fadeInUp">
                <h1>Upcoming Matches (${MATCHES.length})</h1>
                <p>Make your score predictions for the following matches</p>
            </div>

            ${matchCardsHTML}

            <div class="submit-section fadeInUp">
                <button 
                    class="btn btn-primary" 
                    onclick="submitPredictions()" 
                    style="max-width: 400px; margin: 0 auto;"
                >
                    <i class="fas fa-check-circle"></i> Submit All Predictions
                </button>
            </div>
        </div>
    `;
}

// Increment score
function incrementScore(inputId) {
    const input = document.getElementById(inputId);
    if (input) {
        let value = parseInt(input.value) || 0;
        if (value < 20) {
            input.value = value + 1;
        }
    }
}

// Decrement score
function decrementScore(inputId) {
    const input = document.getElementById(inputId);
    if (input) {
        let value = parseInt(input.value) || 0;
        if (value > 0) {
            input.value = value - 1;
        }
    }
}

// Submit all predictions
function submitPredictions() {
    const predictions = [];
    let allValid = true;

    // Collect all predictions
    MATCHES.forEach(match => {
        const team1Input = document.getElementById(
            `match_${match.id}_team1`
        );
        const team2Input = document.getElementById(
            `match_${match.id}_team2`
        );

        if (team1Input && team2Input) {
            const team1Score = parseInt(team1Input.value) || 0;
            const team2Score = parseInt(team2Input.value) || 0;

            // Save to localStorage
            const matchKey = `match_${match.id}`;
            localStorage.setItem(matchKey, JSON.stringify({
                matchId: match.id,
                team1: match.team1.name,
                team2: match.team2.name,
                team1Score: team1Score,
                team2Score: team2Score,
                submittedAt: new Date().toISOString()
            }));

            predictions.push({
                matchId: match.id,
                team1: match.team1.name,
                team2: match.team2.name,
                team1Score: team1Score,
                team2Score: team2Score
            });
        }
    });

    // Save all predictions to localStorage
    localStorage.setItem('allPredictions', JSON.stringify(predictions));

    // Show success message
    alert(
        `✅ Predictions submitted successfully!\n\n` +
        `You have made predictions for ${predictions.length} matches.\n\n` +
        `Note: This is saved locally. When backend is ready, ` +
        `these will be sent to the server.`
    );

    // Log for debugging
    console.log('All Predictions:', predictions);
}

// Open prediction history
function openHistory() {
    const allPredictions = JSON.parse(
        localStorage.getItem('allPredictions') || '[]'
    );
    
    if (allPredictions.length === 0) {
        alert('No predictions submitted yet.');
        return;
    }

    let historyHTML = '<div style="padding: 20px;">';
    allPredictions.forEach(pred => {
        historyHTML += `
            <div style="
                background: rgba(255,255,255,0.05); 
                padding: 15px; 
                margin: 10px 0; 
                border-radius: 8px; 
                border-left: 4px solid #86BC25;
            ">
                <strong>
                    ${pred.team1} ${pred.team1Score} - 
                    ${pred.team2Score} ${pred.team2}
                </strong>
            </div>
        `;
    });
    historyHTML += '</div>';

    // Display in modal or alert
    alert(
        `Your Predictions:\n\n` +
        allPredictions
            .map(p => 
                `${p.team1} ${p.team1Score} - ${p.team2Score} ${p.team2}`
            )
            .join('\n')
    );
}