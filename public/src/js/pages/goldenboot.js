// Golden Boot Prediction Page

function createGoldenBootPage() {
    return `
        <div class="prediction-page fadeInUp">
            <div class="prediction-header">
                <button class="back-button" onclick="goBackToPreviousPage()">
                    <i class="fas fa-arrow-left"></i> Back
                </button>
                <h1>Golden Boot</h1>
                <div class="progress-indicator">
                    <div class="progress-step completed">
                        <i class="fas fa-check"></i>
                    </div>
                    <div class="progress-line"></div>
                    <div class="progress-step active">2</div>
                    <div class="progress-line"></div>
                    <div class="progress-step">3</div>
                </div>
            </div>

            <div class="prediction-content">
                <div class="prediction-form">
                    <label for="golden-boot">
                        <i class="fas fa-shoe-prints"></i> Who will win the Golden Boot? (Top Scorer)
                    </label>
                    <input 
                        type="text" 
                        id="golden-boot" 
                        class="form-input" 
                        placeholder="e.g., Kylian Mbappé"
                        maxlength="100"
                    >
                    <div class="character-counter">
                        <span id="boot-count">0</span>/100
                    </div>
                    <small class="form-hint">Enter the player name you think will score the most goals</small>
                </div>

                <div class="prediction-actions">
                    <button class="btn btn-primary" onclick="submitGoldenBootDirect()">
                        <i class="fas fa-arrow-right"></i> Continue to Next Step
                    </button>
                </div>
            </div>
        </div>
    `;
}

function submitGoldenBootDirect() {
    const playerName = document.getElementById('golden-boot').value.trim();

    if (!playerName) {
        alert('Please enter a player name');
        return;
    }

    if (playerName.length < 2) {
        alert('Player name must be at least 2 characters');
        return;
    }

    // Save to localStorage
    const predictions = JSON.parse(localStorage.getItem('predictions') || '{}');
    predictions.goldenBoot = playerName;
    localStorage.setItem('predictions', JSON.stringify(predictions));

    // Update prediction state
    const predictionState = JSON.parse(localStorage.getItem('predictionState') || '{}');
    predictionState.predictions.goldenBoot = true;
    predictionState.completedAt.goldenBoot = new Date().toISOString();
    localStorage.setItem('predictionState', JSON.stringify(predictionState));

    // Navigate to golden glove page
    const goldenGlovePage = document.getElementById('goldenGlovePage');
    if (goldenGlovePage) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
            page.style.display = 'none';
        });
        
        // Show golden glove page
        goldenGlovePage.innerHTML = createGoldenGlovePage();
        goldenGlovePage.classList.add('active');
        goldenGlovePage.style.display = 'block';
    }
}

// Update character counter
document.addEventListener('DOMContentLoaded', function() {
    const bootInput = document.getElementById('golden-boot');
    if (bootInput) {
        bootInput.addEventListener('input', function() {
            const count = document.getElementById('boot-count');
            if (count) {
                count.textContent = this.value.length;
            }
        });
    }
});