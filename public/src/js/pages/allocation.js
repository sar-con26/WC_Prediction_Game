// Country Allocation Page

function createAllocationPage() {
    // All 48 World Cup 2026 Teams
    const allTeams = [
        // CONCACAF (6)
        { name: 'United States', flag: '🇺🇸' },
        { name: 'Mexico', flag: '🇲🇽' },
        { name: 'Canada', flag: '🇨🇦' },
        { name: 'Curaçao', flag: '🇨🇼' },
        { name: 'Haiti', flag: '🇭🇹' },
        { name: 'Panama', flag: '🇵🇦' },
        
        // CONMEBOL (6)
        { name: 'Argentina', flag: '🇦🇷' },
        { name: 'Brazil', flag: '🇧🇷' },
        { name: 'Colombia', flag: '🇨🇴' },
        { name: 'Ecuador', flag: '🇪🇨' },
        { name: 'Paraguay', flag: '🇵🇾' },
        { name: 'Uruguay', flag: '🇺🇾' },
        
        // UEFA (16)
        { name: 'Austria', flag: '🇦🇹' },
        { name: 'Belgium', flag: '🇧🇪' },
        { name: 'Bosnia and Herzegovina', flag: '🇧🇦' },
        { name: 'Croatia', flag: '🇭🇷' },
        { name: 'Czechia', flag: '🇨🇿' },
        { name: 'England', flag: '🇬🇧' },
        { name: 'France', flag: '🇫🇷' },
        { name: 'Germany', flag: '🇩🇪' },
        { name: 'Netherlands', flag: '🇳🇱' },
        { name: 'Norway', flag: '🇳🇴' },
        { name: 'Portugal', flag: '🇵🇹' },
        { name: 'Scotland', flag: '🇬🇧' },
        { name: 'Spain', flag: '🇪🇸' },
        { name: 'Sweden', flag: '🇸🇪' },
        { name: 'Switzerland', flag: '🇨🇭' },
        { name: 'Türkiye', flag: '🇹🇷' },
        
        // AFC (9)
        { name: 'Australia', flag: '🇦🇺' },
        { name: 'Iraq', flag: '🇮🇶' },
        { name: 'IR Iran', flag: '🇮🇷' },
        { name: 'Japan', flag: '🇯🇵' },
        { name: 'Jordan', flag: '🇯🇴' },
        { name: 'Korea Republic', flag: '🇰🇷' },
        { name: 'Qatar', flag: '🇶🇦' },
        { name: 'Saudi Arabia', flag: '🇸🇦' },
        { name: 'Uzbekistan', flag: '🇺🇿' },
        
        // CAF (10)
        { name: 'Algeria', flag: '🇩🇿' },
        { name: 'Cabo Verde', flag: '🇨🇻' },
        { name: 'Congo DR', flag: '🇨🇩' },
        { name: 'Côte d\'Ivoire', flag: '🇨🇮' },
        { name: 'Egypt', flag: '🇪🇬' },
        { name: 'Ghana', flag: '🇬🇭' },
        { name: 'Morocco', flag: '🇲🇦' },
        { name: 'Senegal', flag: '🇸🇳' },
        { name: 'South Africa', flag: '🇿🇦' },
        { name: 'Tunisia', flag: '🇹🇳' },
        
        // OFC (1)
        { name: 'New Zealand', flag: '🇳🇿' }
    ];
    
    // Function to get random team
    function getRandomTeam() {
        const randomIndex = Math.floor(Math.random() * allTeams.length);
        return allTeams[randomIndex];
    }
    
    // Get random team for this user
    const assignedTeam = getRandomTeam();
    
    // Save to localStorage
    localStorage.setItem('assignedTeam', JSON.stringify(assignedTeam));
    
    return `
        <div class="allocation-overlay">
            <div class="allocation-popup popupAppear">
                <h2>🎉 Congratulations! 🎉</h2>
                <div class="country-name countryReveal">${assignedTeam.flag} ${assignedTeam.name}</div>
                <p class="allocation-message">You've been assigned ${assignedTeam.name} for the sweepstake! Good luck with your predictions!</p>
                <button class="btn btn-primary" onclick="initPredictionFlow()">
                    Continue to App <i class="fas fa-arrow-right"></i>
                </button>
            </div>
        </div>
    `;
}

function initPredictionFlow() {
    const userId = localStorage.getItem('userId');
    const assignedTeam = JSON.parse(localStorage.getItem('assignedTeam') || '{}');
    
    localStorage.setItem('predictionState', JSON.stringify({
        userId: userId,
        assignedTeam: assignedTeam,
        teamAssigned: true,
        predictions: {
            tournamentWinner: false,
            goldenBoot: false,
            goldenGlove: false
        },
        completedAt: {},
        allPredictionsComplete: false
    }));
    
    localStorage.setItem('predictions', JSON.stringify({}));
    
    setTimeout(() => {
        showPage('tournamentWinnerPage');
    }, 1500);
}