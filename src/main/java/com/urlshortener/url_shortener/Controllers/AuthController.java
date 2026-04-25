package com.urlshortener.url_shortener.Controllers;

import com.urlshortener.url_shortener.DTO.*;
import com.urlshortener.url_shortener.Service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public AuthResponse register(@RequestBody RegisterRequest request) {
        log.info("Register request received username={}, email={}", request.getUsername(), request.getEmail());
        return userService.register(request);
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        log.info("Login request received usernameOrEmail={}", request.getUsernameOrEmail());
        return userService.login(request);
    }

    @PostMapping("/forgot-password")
    public AuthResponse forgotPassword(@RequestBody ForgotPasswordRequest request) {
        log.info("Forgot password request received email={}", request.getEmail());
        return userService.forgotPassword(request);
    }

    @PostMapping("/reset-password")
    public AuthResponse resetPassword(@RequestBody ResetPasswordRequest request) {
        log.info("Reset password request received");
        return userService.resetPassword(request);
    }
}