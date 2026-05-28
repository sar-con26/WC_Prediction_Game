// login.js - UPDATED WITH API INTEGRATION

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
                
                <div id="login-error" class="error-message" style="display: none; color: #EF4444; margin-bottom: 15px; padding: 12px; background: rgba(239, 68, 68, 0.1); border-radius: 8px; border-left: 3px solid #EF4444;"></div>
                
                <button type="button" class="btn btn-primary" onclick="handleLogin()">
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

/**
 * Handle login button click
 */
async function handleLogin() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorDiv = document.getElementById('login-error');

    // Clear previous errors
    errorDiv.style.display = 'none';
    errorDiv.textContent = '';

    // Validation
    if (!email || !password) {
        errorDiv.textContent = '❌ Please enter both email and password';
        errorDiv.style.display = 'block';
        return;
    }

    if (!email.includes('@')) {
        errorDiv.textContent = '❌ Please enter a valid email address';
        errorDiv.style.display = 'block';
        return;
    }

    // Show loading state
    const loginBtn = event.target;
    const originalText = loginBtn.innerHTML;
    loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
    loginBtn.disabled = true;

    try {
        // Call API
        const response = await loginUser(email, password);

        // Store user data
        localStorage.setItem('userId', response.user_id);
        localStorage.setItem('userEmail', response.email);
        localStorage.setItem('userName', response.username);
        
        // Store JWT token
        storeJWTToken(response.jwt_token);

        // Show success message
        alert(`✅ Welcome back, ${response.username}!`);

        // Redirect to home page
        setTimeout(() => {
            showPage('homePage');
        }, 500);

    } catch (error) {
        errorDiv.textContent = `❌ ${error.message}`;
        errorDiv.style.display = 'block';
        console.error('Login failed:', error);

    } finally {
        // Reset button
        loginBtn.innerHTML = originalText;
        loginBtn.disabled = false;
    }
}