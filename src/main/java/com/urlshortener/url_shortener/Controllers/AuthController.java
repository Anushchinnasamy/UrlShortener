package com.urlshortener.url_shortener.Controllers;

import com.urlshortener.url_shortener.DTO.AuthResponse;
import com.urlshortener.url_shortener.DTO.LoginRequest;
import com.urlshortener.url_shortener.DTO.LoginResponse;
import com.urlshortener.url_shortener.DTO.RegisterRequest;
import com.urlshortener.url_shortener.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public AuthResponse register(@RequestBody RegisterRequest request) {
        return userService.register(request);
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        return userService.login(request);
    }
}