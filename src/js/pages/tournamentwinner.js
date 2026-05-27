// Tournament Winner Prediction Page

function createTournamentWinnerPage() {
    const teams = [
        // CONCACAF - HOST NATIONS (3 teams)
        '🇺🇸 United States',
        '🇲🇽 Mexico',
        '🇨🇦 Canada',
        
        // CONCACAF - QUALIFIED (3 teams)
        '🇨🇼 Curaçao',
        '🇭🇹 Haiti',
        '🇵🇦 Panama',
        
        // CONMEBOL (6 teams)
        '🇦🇷 Argentina',
        '🇧🇷 Brazil',
        '🇨🇴 Colombia',
        '🇪🇨 Ecuador',
        '🇵🇾 Paraguay',
        '🇺🇾 Uruguay',
        
        // UEFA (16 teams)
        '🇦🇹 Austria',
        '🇧🇪 Belgium',
        '🇧🇦 Bosnia and Herzegovina',
        '🇭🇷 Croatia',
        '🇨🇿 Czechia',
        '🇬🇧 England',
        '🇫🇷 France',
        '🇩🇪 Germany',
        '🇳🇱 Netherlands',
        '🇳🇴 Norway',
        '🇵🇹 Portugal',
        '🇬🇧 Scotland',
        '🇪🇸 Spain',
        '🇸🇪 Sweden',
        '🇨🇭 Switzerland',
        '🇹🇷 Türkiye',
        
        // AFC (9 teams)
        '🇦🇺 Australia',
        '🇮🇶 Iraq',
        '🇮🇷 IR Iran',
        '🇯🇵 Japan',
        '🇯🇴 Jordan',
        '🇰🇷 Korea Republic',
        '🇶🇦 Qatar',
        '🇸🇦 Saudi Arabia',
        '🇺🇿 Uzbekistan',
        
        // CAF (10 teams)
        '🇩🇿 Algeria',
        '🇨🇻 Cabo Verde',
        '🇨🇩 Congo DR',
        '🇨🇮 Côte d\'Ivoire',
        '🇪🇬 Egypt',
        '🇬🇭 Ghana',
        '🇲🇦 Morocco',
        '🇸🇳 Senegal',
        '🇿🇦 South Africa',
        '🇹🇳 Tunisia',
        
        // OFC (1 team)
        '🇳🇿 New Zealand'
    ];

    const teamOptions = teams.map(team => 
        `<option value="${team}">${team}</option>`
    ).join('');

    return `
        <div class="prediction-page fadeInUp">
            <div class="prediction-header">
                <button class="back-button" onclick="showPage('allocationPage')">
                    <i class="fas fa-arrow-left"></i> Back
                </button>
                <h1>Tournament Winner</h1>
                <div class="progress-indicator">
                    <div class="progress-step active">1</div>
                    <div class="progress-line"></div>
                    <div class="progress-step">2</div>
                    <div class="progress-line"></div>
                    <div class="progress-step">3</div>
                </div>
            </div>

            <div class="prediction-content">
                <div class="prediction-form">
                    <label for="tournament-winner">
                        <i class="fas fa-trophy"></i> Who will win the 2026 World Cup?
                    </label>
                    <select id="tournament-winner" class="form-input form-select">
                        <option value="">-- Select a team --</option>
                        ${teamOptions}
                    </select>
                    <small class="form-hint">Select the team you think will win the tournament</small>
                </div>

                <div class="prediction-actions">
                    <button class="btn btn-primary" onclick="submitTournamentWinner()">
                        <i class="fas fa-arrow-right"></i> Continue
                    </button>
                </div>
            </div>
        </div>
    `;
}

function submitTournamentWinner() {
    const selection = document.getElementById('tournament-winner').value;

    if (!selection) {
        alert('Please select a team');
        return;
    }

    // Save to localStorage
    const predictions = JSON.parse(localStorage.getItem('predictions') || '{}');
    predictions.tournamentWinner = selection;
    localStorage.setItem('predictions', JSON.stringify(predictions));

    // Update prediction state
    const predictionState = JSON.parse(localStorage.getItem('predictionState') || '{}');
    predictionState.predictions.tournamentWinner = true;
    predictionState.completedAt.tournamentWinner = new Date().toISOString();
    localStorage.setItem('predictionState', JSON.stringify(predictionState));

    // Navigate to golden boot page directly
    const goldenBootPage = document.getElementById('goldenBootPage');
    if (goldenBootPage) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
            page.style.display = 'none';
        });
        
        // Show golden boot page
        goldenBootPage.innerHTML = createGoldenBootPage();
        goldenBootPage.classList.add('active');
        goldenBootPage.style.display = 'block';
    }
}