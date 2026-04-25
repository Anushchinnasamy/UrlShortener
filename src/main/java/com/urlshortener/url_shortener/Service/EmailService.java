package com.urlshortener.url_shortener.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    @Value("${app.email.from}")
    private String fromEmail;

    @Value("${app.email.enabled:false}")
    private boolean emailEnabled;

    @Async
    public void sendPasswordResetEmail(String toEmail, String username, String resetLink) {
        log.info("=== EMAIL SERVICE: sendPasswordResetEmail called ===");
        log.info("Email enabled: {}", emailEnabled);
        log.info("To: {}, From: {}", toEmail, fromEmail);
        
        if (!emailEnabled) {
            log.warn("Email service is DISABLED. Reset link would be sent to: {}", toEmail);
            log.info("Reset link: {}", resetLink);
            return;
        }

        try {
            log.info("Creating MIME message for password reset...");
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Password Reset Request - Shortly URL Shortener");

            String htmlContent = buildPasswordResetEmailHtml(username, resetLink);
            helper.setText(htmlContent, true);

            log.info("Sending password reset email via SMTP...");
            mailSender.send(message);
            log.info("✅ Password reset email sent successfully to: {}", toEmail);

        } catch (Exception e) {
            log.error("❌ Failed to send password reset email to: {}", toEmail, e);
            log.error("Error details: {}", e.getMessage());
            // Don't throw exception - log and continue
        }
    }

    private String buildPasswordResetEmailHtml(String username, String resetLink) {
        String template = """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                        line-height: 1.6;
                        color: %%333;
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                    }
                    .container {
                        background: linear-gradient(135deg, %%667eea 0%%, %%764ba2 100%%);
                        border-radius: 10px;
                        padding: 40px;
                        color: white;
                    }
                    .content {
                        background: white;
                        border-radius: 8px;
                        padding: 30px;
                        margin-top: 20px;
                        color: %%333;
                    }
                    .button {
                        display: inline-block;
                        padding: 14px 28px;
                        background: linear-gradient(135deg, %%667eea 0%%, %%764ba2 100%%);
                        color: white;
                        text-decoration: none;
                        border-radius: 6px;
                        font-weight: 600;
                        margin: 20px 0;
                    }
                    .footer {
                        margin-top: 30px;
                        padding-top: 20px;
                        border-top: 1px solid %%eee;
                        font-size: 12px;
                        color: %%666;
                        text-align: center;
                    }
                    .warning {
                        background: %%fff3cd;
                        border-left: 4px solid %%ffc107;
                        padding: 12px;
                        margin: 20px 0;
                        border-radius: 4px;
                        color: %%856404;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1 style="margin: 0; font-size: 28px;">🔐 Password Reset Request</h1>
                    <p style="margin: 10px 0 0 0; opacity: 0.9;">Shortly URL Shortener</p>
                </div>
                
                <div class="content">
                    <h2 style="color: %%667eea; margin-top: 0;">Hello, %s!</h2>
                    
                    <p>We received a request to reset your password for your Shortly account.</p>
                    
                    <p>Click the button below to reset your password:</p>
                    
                    <div style="text-align: center;">
                        <a href="%s" class="button">Reset Password</a>
                    </div>
                    
                    <div class="warning">
                        <strong>⚠️ Security Notice:</strong>
                        <ul style="margin: 10px 0 0 0; padding-left: 20px;">
                            <li>This link will expire in <strong>1 hour</strong></li>
                            <li>This link can only be used <strong>once</strong></li>
                            <li>If you didn't request this, please ignore this email</li>
                        </ul>
                    </div>
                    
                    <p style="margin-top: 20px;">If the button doesn't work, copy and paste this link into your browser:</p>
                    <p style="word-break: break-all; background: %%f5f5f5; padding: 10px; border-radius: 4px; font-size: 12px;">
                        %s
                    </p>
                    
                    <div class="footer">
                        <p>This is an automated email from Shortly URL Shortener.</p>
                        <p>If you didn't request a password reset, you can safely ignore this email.</p>
                        <p style="margin-top: 10px;">© 2026 Shortly. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
            """;
        
        // Replace %% with # for CSS colors
        String html = String.format(template, username, resetLink, resetLink);
        return html.replace("%%", "#");
    }

    @Async
    public void sendWelcomeEmail(String toEmail, String username) {
        log.info("=== EMAIL SERVICE: sendWelcomeEmail called ===");
        log.info("Email enabled: {}", emailEnabled);
        log.info("To: {}, From: {}", toEmail, fromEmail);
        
        if (!emailEnabled) {
            log.warn("Email service is DISABLED. Welcome email would be sent to: {}", toEmail);
            return;
        }

        try {
            log.info("Creating MIME message for welcome email...");
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Welcome to Shortly URL Shortener! 🎉");

            String htmlContent = buildWelcomeEmailHtml(username);
            helper.setText(htmlContent, true);

            log.info("Sending welcome email via SMTP...");
            mailSender.send(message);
            log.info("✅ Welcome email sent successfully to: {}", toEmail);

        } catch (Exception e) {
            log.error("❌ Failed to send welcome email to: {}", toEmail, e);
            log.error("Error details: {}", e.getMessage());
            // Don't throw exception for welcome email - it's not critical
        }
    }

    private String buildWelcomeEmailHtml(String username) {
        String template = """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        line-height: 1.6;
                        color: %%333;
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                    }
                    .container {
                        background: linear-gradient(135deg, %%667eea 0%%, %%764ba2 100%%);
                        border-radius: 10px;
                        padding: 40px;
                        color: white;
                        text-align: center;
                    }
                    .content {
                        background: white;
                        border-radius: 8px;
                        padding: 30px;
                        margin-top: 20px;
                        color: %%333;
                    }
                    .feature {
                        background: %%f8f9fa;
                        border-radius: 6px;
                        padding: 15px;
                        margin: 10px 0;
                        text-align: left;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1 style="margin: 0; font-size: 36px;">🎉</h1>
                    <h2 style="margin: 10px 0;">Welcome to Shortly!</h2>
                    <p style="opacity: 0.9;">Your account has been created successfully</p>
                </div>
                
                <div class="content">
                    <h2 style="color: %%667eea;">Hello, %s!</h2>
                    
                    <p>Thank you for joining Shortly, the modern URL shortener with style!</p>
                    
                    <h3 style="color: %%667eea;">What you can do:</h3>
                    
                    <div class="feature">
                        <strong>🔗 Shorten URLs</strong><br>
                        Transform long, unwieldy URLs into clean, shareable short links
                    </div>
                    
                    <div class="feature">
                        <strong>📊 Track Analytics</strong><br>
                        Monitor click counts and engagement for every link you create
                    </div>
                    
                    <div class="feature">
                        <strong>🔒 Secure & Private</strong><br>
                        Your links are protected with JWT authentication
                    </div>
                    
                    <p style="margin-top: 30px;">Ready to get started? Log in to your dashboard and create your first short link!</p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="http://localhost:5173/login" style="display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, %%667eea 0%%, %%764ba2 100%%); color: white; text-decoration: none; border-radius: 6px; font-weight: 600;">
                            Go to Dashboard
                        </a>
                    </div>
                    
                    <p style="text-align: center; color: %%666; font-size: 12px; margin-top: 30px;">
                        © 2026 Shortly. All rights reserved.
                    </p>
                </div>
            </body>
            </html>
            """;
        
        // Replace %% with # for CSS colors
        String html = String.format(template, username);
        return html.replace("%%", "#");
    }
}
