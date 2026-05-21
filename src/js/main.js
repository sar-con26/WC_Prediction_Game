// Main App Logic

// Initialize app
function initApp() {
    const app = document.getElementById('app');
    
    // Create login page
    const loginPage = document.createElement('div');
    loginPage.className = 'page active';
    loginPage.id = 'loginPage';
    loginPage.innerHTML = createLoginPage();
    app.appendChild(loginPage);
    
    // Create signup page
    const signupPage = document.createElement('div');
    signupPage.className = 'page';
    signupPage.id = 'signupPage';
    signupPage.innerHTML = createSignupPage();
    app.appendChild(signupPage);
    
    // Create verification page
    const verificationPage = document.createElement('div');
    verificationPage.className = 'page';
    verificationPage.id = 'verificationPage';
    verificationPage.innerHTML = createVerificationPage();
    app.appendChild(verificationPage);
    
    // Create allocation page
    const allocationPage = document.createElement('div');
    allocationPage.className = 'page';
    allocationPage.id = 'allocationPage';
    allocationPage.innerHTML = createAllocationPage();
    app.appendChild(allocationPage);
    
    // Create home page
    const homePage = document.createElement('div');
    homePage.className = 'page';
    homePage.id = 'homePage';
    homePage.innerHTML = createHomePage();
    app.appendChild(homePage);
    
    // Create predictions page
    const predictionsPage = document.createElement('div');
    predictionsPage.className = 'page';
    predictionsPage.id = 'scoreGuesserPage';
    predictionsPage.innerHTML = createPredictionsPage();
    app.appendChild(predictionsPage);
}

// Start app when DOM is ready
document.addEventListener('DOMContentLoaded', initApp);