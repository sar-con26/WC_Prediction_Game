// Sign-Up Page

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
                    <label for="signup-password">Password</label>
                    <input type="password" id="signup-password" class="form-input" placeholder="Create a password">
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

// Handle signup
async function handleSignup() {
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value.trim();
    const confirmPassword = document.getElementById('confirm-password').value.trim();
    const county = document.getElementById('signup-county').value.trim();
    
    // Validation
    if (!email || !password || !confirmPassword || !county) {
        alert('Please fill in all fields');
        return;
    }

    if (!email.includes('@')) {
        alert('Please enter a valid email');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    if (password.length < 8) {
        alert('Password must be at least 8 characters');
        return;
    }

    if (!/[A-Z]/.test(password)) {
        alert('Password must contain at least one uppercase letter');
        return;
    }

    if (!/[0-9]/.test(password)) {
        alert('Password must contain at least one number');
        return;
    }

    try {
        // Show loading state
        const button = event.target;
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating user...';
        button.disabled = true;

        // Call API
        const response = await registerUser({
            email: email,
            username: email.split('@')[0], // Use email prefix as username
            password: password,
            country_guess: county
        });

        // Store user data
        localStorage.setItem('userId', response.user_id);
        localStorage.setItem('userName', response.username);
        localStorage.setItem('userEmail', response.email);
        localStorage.setItem('userCounty', county);

        // Reset button
        button.innerHTML = originalText;
        button.disabled = false;

        // Show success message
        alert(`✅ Account created successfully!\nWelcome, ${response.username}!`);

        // Navigate to verification page
        showPage('verificationPage');

    } catch (error) {
        // Reset button
        const button = event.target;
        button.innerHTML = '<i class="fas fa-user-plus"></i> Sign Up';
        button.disabled = false;

        // Show error message
        console.error('Signup error:', error);
        alert(`❌ Registration failed: ${error.message}`);
    }
}