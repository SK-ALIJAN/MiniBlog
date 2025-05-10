exports.forgotPasswordTemplate = ({ otp }) => {
    return `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
            <p style="font-size: 16px;">Dear User,</p>
            <p style="font-size: 16px;">You have requested to reset your password. Please use the OTP below to complete the process:</p>
            
            <div style="font-size: 24px; font-weight: bold; text-align: center; color: #603384; padding: 10px; border: 2px dashed #603384; display: inline-block; margin: 10px auto;">
                ${otp}
            </div>

            <p style="font-size: 16px; color: red;"><strong>Note:</strong> This OTP is valid for only <strong>5 minutes</strong>. Do not share this OTP with anyone.</p>

            <p style="font-size: 16px;">If you did not request this reset, you can safely ignore this email.</p>
            
            <p style="margin-top: 20px; font-size: 16px;">Best Regards,<br/><strong>Alijan</strong></p>
        </div>
        `;
};
