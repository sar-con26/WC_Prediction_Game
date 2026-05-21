// Country Allocation Page

function createAllocationPage() {
    return `
        <div class="allocation-overlay">
            <div class="allocation-popup popupAppear">
                <h2>🎉 Congratulations! 🎉</h2>
                <div class="country-name countryReveal">Spain</div>
                <p class="allocation-message">You've been assigned Spain for the sweepstake! Good luck with your predictions!</p>
                <button class="btn btn-primary" onclick="showPage('homePage')">
                    Continue to App <i class="fas fa-arrow-right"></i>
                </button>
            </div>
        </div>
    `;
}