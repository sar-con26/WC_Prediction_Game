// Country Allocation Page

function createAllocationPage() {
    return `
        <div class="allocation-overlay">
            <div class="allocation-popup popupAppear">
                <h2>🎉 Congratulations! 🎉</h2>
                <div class="country-name countryReveal">Spain</div>
                <p class="allocation-message">You've been assigned Spain for the sweepstake! Good luck with your predictions!</p>
                <button class="btn btn-primary" onclick="initPredictionFlow()">
                    Continue to App <i class="fas fa-arrow-right"></i>
                </button>
            </div>
        </div>
    `;
}

function initPredictionFlow() {
    const userId = localStorage.getItem('userId');
    
    localStorage.setItem('predictionState', JSON.stringify({
        userId: userId,
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
