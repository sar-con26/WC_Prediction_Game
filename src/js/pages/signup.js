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
                </div>                <div class="form-group">
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
                
                <button type="button" class="btn btn-primary" onclick="showPage('verificationPage')">
                    <i class="fas fa-user-plus"></i> Sign Up
                </button>
                
                <button type="button" class="btn btn-secondary" onclick="showPage('loginPage')">
                    <i class="fas fa-arrow-left"></i> Back to Login
                </button>
            </div>        </div>
    `;
}

// Handle signup
function handleSignup() {
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value.trim();
    const confirmPassword = document.getElementById('confirm-password').value.trim();    // Validation
    const county = document.getElementById('signup-county').value.trim();
    
    if (!email || !password || !confirmPassword || !county) {
        alert('Please fill in all fields');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    if (password.length < 6) {
        alert('Password must be at least 6 characters');
        return;
    }

    // Check if user already exists
    const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
    if (allUsers.find(u => u.email === email)) {
        alert('User already exists with this email');
        return;
    }

    // Extract name from email (before @)
    const name = email.split('@')[0].replace(/[._-]/g, ' ').toUpperCase();    // Create new user
    const newUser = {
        id: Date.now().toString(),
        name: name,
        email: email,
        password: password, // In production, this should be hashed!
        county: county,
        points: 0,
        team: null,
        registeredAt: new Date().toISOString()
    };

    // Save user to localStorage
    allUsers.push(newUser);
    localStorage.setItem('allUsers', JSON.stringify(allUsers));    // Save current user info
    localStorage.setItem('userId', newUser.id);
    localStorage.setItem('userName', newUser.name);
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userCounty', county);

    // Go to verification page
    showPage('verificationPage');
}