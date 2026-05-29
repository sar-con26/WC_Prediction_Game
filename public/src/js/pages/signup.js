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
                    <label for="signup-username">Username</label>
                    <input type="text" id="signup-username" class="form-input" placeholder="Choose a username (3-20 chars)">
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
                    <label for="signup-country">Country Guess</label>
                    <select id="signup-country" class="form-input" style="background-color: #3a3a3a; color: white;">
                        <option value="">Select your country</option>
                        <option value="France">🇫🇷 France</option>
                        <option value="Brazil">🇧🇷 Brazil</option>
                        <option value="Argentina">🇦🇷 Argentina</option>
                        <option value="Spain">🇪🇸 Spain</option>
                        <option value="Germany">🇩🇪 Germany</option>
                        <option value="England">🇬🇧 England</option>
                        <option value="Netherlands">🇳🇱 Netherlands</option>
                        <option value="Belgium">🇧🇪 Belgium</option>
                        <option value="Portugal">🇵🇹 Portugal</option>
                        <option value="Italy">🇮🇹 Italy</option>
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
    const username = document.getElementById('signup-username').value.trim();
    const password = document.getElementById('signup-password').value.trim();
    const confirmPassword = document.getElementById('confirm-password').value.trim();
    const country_guess = document.getElementById('signup-country').value.trim();
    
    // Validation
    if (!email || !username || !password || !confirmPassword || !country_guess) {
        alert('Please fill in all fields');
        return;
    }

    if (!email.includes('@')) {
        alert('Please enter a valid email');
        return;
    }

    if (username.length < 3 || username.length > 20) {
        alert('Username must be 3-20 characters');
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
            username: username,
            password: password,
            country_guess: country_guess
        });

        // Store user data
        localStorage.setItem('userId', response.user_id);
        localStorage.setItem('userName', response.username);
        localStorage.setItem('userEmail', response.email);
        localStorage.setItem('userCountry', country_guess);

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