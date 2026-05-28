// signup.js - UPDATED WITH API INTEGRATION

function createSignupPage() {
    return `
        <div class="login-container fadeInUp">
            <div class="login-logo">
                <img src="https://www.deloitte.com/content/dam/assets-shared/logos/svg/a-d/deloitte.svg" alt="Deloitte">
                <h1>Create Account</h1>
                <p>Join the World Cup prediction competition</p>
            </div>
            
            <div>
                <div class="form-group">
                    <label for="signup-email">Email Address</label>
                    <input type="email" id="signup-email" class="form-input" placeholder="your.email@deloitte.ie">
                </div>
                
                <div class="form-group">
                    <label for="signup-username">Username</label>
                    <input type="text" id="signup-username" class="form-input" placeholder="Choose a username (3-20 characters)">
                </div>
                
                <div class="form-group">
                    <label for="signup-password">Password</label>
                    <input type="password" id="signup-password" class="form-input" placeholder="Create a password (min 8 chars, 1 uppercase, 1 number)">
                </div>

                <div class="form-group">
                    <label for="confirm-password">Confirm Password</label>
                    <input type="password" id="confirm-password" class="form-input" placeholder="Re-enter your password">
                </div>
                
                <div class="form-group">
                    <label for="signup-county">County</label>
                    <select id="signup-county" class="form-input" style="background-color: #3a3a3a; color: white;">
                        <option value="">Select your county</option>
                        <option value="Cork">Cork</option>
                        <option value="Dublin">Dublin</option>
                    </select>
                </div>

                <div id="signup-error" class="error-message" style="display: none; color: #EF4444; margin-bottom: 15px; padding: 12px; background: rgba(239, 68, 68, 0.1); border-radius: 8px; border-left: 3px solid #EF4444;"></div>
                
                <button type="button" class="btn btn-primary" onclick="handleSignup()">
                    <i class="fas fa-user-plus"></i> Sign Up
                </button>
                
                <button type="button" class="btn btn-secondary" onclick="showPage('loginPage')">
                    <i class="fas fa-arrow-left"></i> Back to Login
                </button>
            </div>
        </div>
    `;
}

/**
 * Handle signup button click
 */
async function handleSignup() {
    const email = document.getElementById('signup-email').value.trim();
    const username = document.getElementById('signup-username').value.trim();
    const password = document.getElementById('signup-password').value.trim();
    const confirmPassword = document.getElementById('confirm-password').value.trim();
    const county = document.getElementById('signup-county').value.trim();
    const errorDiv = document.getElementById('signup-error');

    // Clear previous errors
    errorDiv.style.display = 'none';
    errorDiv.textContent = '';

    // Validation
    if (!email || !username || !password || !confirmPassword || !county) {
        errorDiv.textContent = '❌ Please fill in all fields';
        errorDiv.style.display = 'block';
        return;
    }

    if (!email.includes('@')) {
        errorDiv.textContent = '❌ Please enter a valid email address';
        errorDiv.style.display = 'block';
        return;
    }

    if (username.length < 3 || username.length > 20) {
        errorDiv.textContent = '❌ Username must be 3-20 characters';
        errorDiv.style.display = 'block';
        return;
    }

    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(username)) {
        errorDiv.textContent = '❌ Username can only contain letters, numbers, and underscores (must start with letter or underscore)';
        errorDiv.style.display = 'block';
        return;
    }

    if (password.length < 8) {
        errorDiv.textContent = '❌ Password must be at least 8 characters';
        errorDiv.style.display = 'block';
        return;
    }

    if (password !== confirmPassword) {
        errorDiv.textContent = '❌ Passwords do not match';
        errorDiv.style.display = 'block';
        return;
    }

    // Check password strength
    if (!/[A-Z]/.test(password)) {
        errorDiv.textContent = '❌ Password must contain at least one uppercase letter';
        errorDiv.style.display = 'block';
        return;
    }

    if (!/[0-9]/.test(password)) {
        errorDiv.textContent = '❌ Password must contain at least one number';
        errorDiv.style.display = 'block';
        return;
    }

    // Show loading state
    const signupBtn = event.target;
    const originalText = signupBtn.innerHTML;
    signupBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
    signupBtn.disabled = true;

    try {
        // Call API
        const response = await registerUser({
            email: email,
            username: username,
            password: password,
            country_guess: county
        });

        // Store user data
        localStorage.setItem('userId', response.user_id);
        localStorage.setItem('userEmail', response.email);
        localStorage.setItem('userName', response.username);
        localStorage.setItem('userCounty', county);

        // Show success message
        alert(`✅ Account created successfully! Welcome, ${response.username}!`);

        // Redirect to allocation page
        setTimeout(() => {
            showPage('allocationPage');
        }, 500);

    } catch (error) {
        errorDiv.textContent = `❌ ${error.message}`;
        errorDiv.style.display = 'block';
        console.error('Signup failed:', error);

    } finally {
        // Reset button
        signupBtn.innerHTML = originalText;
        signupBtn.disabled = false;
    }
}