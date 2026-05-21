// Login Page

function createLoginPage() {
    return `
        <div class="login-container fadeInUp">
            <div class="login-logo">
                <img src="https://www.deloitte.com/content/dam/assets-shared/logos/svg/a-d/deloitte.svg" alt="Deloitte">
                <h1>World Cup Predictor</h1>
                <p>Make your predictions and compete with colleagues</p>
            </div>
            
            <div>
                <div class="form-group">
                    <label for="email">Email Address</label>
                    <input type="email" id="email" class="form-input" placeholder="your.email@deloitte.ie">
                </div>
                
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" class="form-input" placeholder="Enter your password">
                </div>
                
                <button type="button" class="btn btn-primary" onclick="showPage('homePage')">
                    <i class="fas fa-sign-in-alt"></i> Login
                </button>
                
                <button type="button" class="btn btn-secondary" onclick="showPage('signupPage')">
                    <i class="fas fa-user-plus"></i> Sign Up
                </button>
                
                <div class="forgot-password">
                    <a href="#" onclick="alert('Password reset link sent to your email!'); return false;">Forgot Password?</a>
                </div>
            </div>
        </div>
    `;
}