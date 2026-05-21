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
                
                <button type="button" class="btn btn-primary" onclick="showPage('allocationPage')">
                    <i class="fas fa-check-circle"></i> Verify
                </button>
                
                <div class="forgot-password">
                    <a href="#" onclick="alert('A new verification code has been sent to your email!'); return false;">Resend Code</a>
                </div>
            </div>
        </div>
    `;
}