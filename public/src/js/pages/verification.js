// Email Verification Page

function createVerificationPage() {
    return `
        <div class="login-container fadeInUp">
            <div class="login-logo">
                <img src="https://www.deloitte.com/content/dam/assets-shared/logos/svg/a-d/deloitte.svg" alt="Deloitte">
                <h1>Sign Up Complete!</h1>
                <p>Finish Registration</p>
            </div>
            
            <div class="info-message">
                <i class="fas fa-envelope"></i> A 6-digit verification code has been sent to your email address. Please enter it below to complete registration.
            </div>
            
            <div>
                <div class="form-group">
                    <label for="verification-code">Verification Code</label>
                    <input type="text" id="verification-code" class="verification-code-input" placeholder="000000" maxlength="6">
                </div>
                
                <button type="button" class="btn btn-primary" onclick="handleVerification()">
                    <i class="fas fa-check-circle"></i> Verify
                </button>
                
                <div class="forgot-password">
                    <a href="#" onclick="alert('A new verification code has been sent to your email!'); return false;">Resend Code</a>
                </div>
            </div>
        </div>
    `;
}

// Handle verification
async function handleVerification() {
    const verificationCode = document.getElementById('verification-code').value.trim();
    
    // Validation - for now just check it's 6 digits
    if (!verificationCode) {
        alert('Please enter a verification code');
        return;
    }

    if (verificationCode.length !== 6) {
        alert('Verification code must be 6 digits');
        return;
    }

    if (!/^\d{6}$/.test(verificationCode)) {
        alert('Verification code must contain only numbers');
        return;
    }

    try {
        // Show loading state
        const button = event.target;
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';
        button.disabled = true;

        console.log('Verification code entered:', verificationCode);

        // For now, just accept any 6-digit code (dummy verification)
        // In production, you would call a Lambda function to verify the code
        
        // Reset button
        button.innerHTML = originalText;
        button.disabled = false;

        // Show success message
        alert('✅ Email verified successfully!');

        // Navigate to allocation page (team assignment)
        showPage('allocationPage');

    } catch (error) {
        // Reset button
        const button = event.target;
        button.innerHTML = '<i class="fas fa-check-circle"></i> Verify';
        button.disabled = false;

        // Show error message
        console.error('Verification error:', error);
        alert(`❌ Verification failed: ${error.message}`);
    }
}