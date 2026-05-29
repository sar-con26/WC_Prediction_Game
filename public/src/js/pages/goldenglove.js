// Golden Glove Prediction Page

function createGoldenGlovePage() {
    return `
        <div class="prediction-page fadeInUp">
            <div class="prediction-header">
                <button class="back-button" onclick="goBackToPreviousPage()">
                    <i class="fas fa-arrow-left"></i> Back
                </button>
                <h1>Golden Glove</h1>
                <div class="progress-indicator">
                    <div class="progress-step completed">
                        <i class="fas fa-check"></i>
                    </div>
                    <div class="progress-line"></div>
                    <div class="progress-step completed">
                        <i class="fas fa-check"></i>
                    </div>
                    <div class="progress-line"></div>
                    <div class="progress-step active">3</div>
                </div>
            </div>

            <div class="prediction-content">
                <div class="prediction-form">
                    <label for="golden-glove">
                        <i class="fas fa-hand-paper"></i> Who will win the Golden Glove? (Best Goalkeeper)
                    </label>
                    <input 
                        type="text" 
                        id="golden-glove" 
                        class="form-input" 
                        placeholder="e.g., Gianluigi Donnarumma"
                        maxlength="100"
                    >
                    <div class="character-counter">
                        <span id="glove-count">0</span>/100
                    </div>
                    <small class="form-hint">Enter the goalkeeper name you think will have the best performance</small>
                </div>

                <div class="prediction-actions">
                    <button class="btn btn-primary" onclick="submitGoldenGloveDirect()">
                        <i class="fas fa-check-circle"></i> Complete
                    </button>
                </div>
            </div>
        </div>
    `;
}

function submitGoldenGloveDirect() {
    const gloveInput = document.getElementById('golden-glove');
    
    if (!gloveInput) {
        alert('Error: Input field not found');
        return;
    }
    
    const goalkeeperName = gloveInput.value.trim();

    if (!goalkeeperName) {
        alert('Please enter a goalkeeper name');
        return;
    }

    if (goalkeeperName.length < 2) {
        alert('Goalkeeper name must be at least 2 characters');
        return;
    }

    // Save to localStorage
    const predictions = JSON.parse(localStorage.getItem('predictions') || '{}');
    predictions.goldenGlove = goalkeeperName;
    localStorage.setItem('predictions', JSON.stringify(predictions));

    // Update prediction state
    const predictionState = JSON.parse(localStorage.getItem('predictionState') || '{}');
    predictionState.predictions.goldenGlove = true;
    predictionState.completedAt.goldenGlove = new Date().toISOString();
    predictionState.allPredictionsComplete = true;
    localStorage.setItem('predictionState', JSON.stringify(predictionState));

    // Navigate to homepage
    const homePage = document.getElementById('homePage');
    if (homePage) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
            page.style.display = 'none';
        });
        
        // Show home page
        homePage.innerHTML = createHomePage();
        homePage.classList.add('active');
        homePage.style.display = 'block';
    } else {
        alert('Error: Homepage not found');
    }
}

// Update character counter
document.addEventListener('DOMContentLoaded', function() {
    const gloveInput = document.getElementById('golden-glove');
    if (gloveInput) {
        gloveInput.addEventListener('input', function() {
            const count = document.getElementById('glove-count');
            if (count) {
                count.textContent = this.value.length;
            }
        });
    }
});