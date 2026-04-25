package com.urlshortener.url_shortener.Service;

import com.urlshortener.url_shortener.Entity.User;
import com.urlshortener.url_shortener.Exceptions.BadRequestException;
import com.urlshortener.url_shortener.Exceptions.ResourceNotFoundException;
import com.urlshortener.url_shortener.Exceptions.UnauthorizedException;
import com.urlshortener.url_shortener.Repository.UserRepository;
import com.urlshortener.url_shortener.Util.JwtUtil;
import com.urlshortener.url_shortener.DTO.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private EmailService emailService;

    @Value("${app.base-url:http://localhost:5173}")
    private String frontendBaseUrl;

    // ✅ REGISTER
    public AuthResponse register(RegisterRequest request) {

        userRepository.findByUsername(request.getUsername())
                .ifPresent(u -> {
                    throw new BadRequestException("Username already exists");
                });

        userRepository.findByEmail(request.getEmail())
                .ifPresent(u -> {
                    throw new BadRequestException("Email already exists");
                });

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        userRepository.save(user);

        // Send welcome email (async, non-blocking)
        try {
            emailService.sendWelcomeEmail(user.getEmail(), user.getUsername());
        } catch (Exception e) {
            // Log but don't fail registration if email fails
        }

        return new AuthResponse("User registered successfully");
    }

    // ✅ LOGIN (username or email)
    public LoginResponse login(LoginRequest request) {

        User existingUser = userRepository.findByUsernameOrEmail(
                request.getUsernameOrEmail(), 
                request.getUsernameOrEmail()
        ).orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), existingUser.getPassword())) {
            throw new UnauthorizedException("Invalid credentials");
        }

        String token = jwtUtil.generateToken(existingUser.getUsername());

        return new LoginResponse(token);
    }

    // ✅ FORGOT PASSWORD
    public AuthResponse forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("No account found with this email"));

        // Generate reset token
        String resetToken = UUID.randomUUID().toString();
        user.setResetToken(resetToken);
        user.setResetTokenExpiry(System.currentTimeMillis() + 3600000); // 1 hour

        userRepository.save(user);

        // Generate reset link
        String resetLink = frontendBaseUrl + "/reset-password?token=" + resetToken;
        
        // Send email
        try {
            emailService.sendPasswordResetEmail(user.getEmail(), user.getUsername(), resetLink);
            return new AuthResponse("Password reset link sent to your email");
        } catch (Exception e) {
            // If email fails, still return the link for development
            return new AuthResponse("Password reset link: " + resetLink);
        }
    }

    // ✅ RESET PASSWORD
    public AuthResponse resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByResetToken(request.getToken())
                .orElseThrow(() -> new BadRequestException("Invalid or expired reset token"));

        // Check if token is expired
        if (user.getResetTokenExpiry() < System.currentTimeMillis()) {
            throw new BadRequestException("Reset token has expired");
        }

        // Update password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);

        userRepository.save(user);

        return new AuthResponse("Password reset successfully");
    }
}