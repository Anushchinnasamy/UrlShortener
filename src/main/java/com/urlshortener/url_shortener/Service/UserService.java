package com.urlshortener.url_shortener.Service;

import com.urlshortener.url_shortener.Entity.User;
import com.urlshortener.url_shortener.Exceptions.BadRequestException;
import com.urlshortener.url_shortener.Exceptions.ResourceNotFoundException;
import com.urlshortener.url_shortener.Exceptions.UnauthorizedException;
import com.urlshortener.url_shortener.Repository.UserRepository;
import com.urlshortener.url_shortener.Util.JwtUtil;
import com.urlshortener.url_shortener.DTO.LoginRequest;
import com.urlshortener.url_shortener.DTO.LoginResponse;
import com.urlshortener.url_shortener.DTO.RegisterRequest;
import com.urlshortener.url_shortener.DTO.AuthResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // ✅ REGISTER
    public AuthResponse register(RegisterRequest request) {

        userRepository.findByUsername(request.getUsername())
                .ifPresent(u -> {
                    throw new BadRequestException("User already exists");
                });

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        userRepository.save(user);

        return new AuthResponse("User registered successfully");
    }

    // ✅ LOGIN
    public LoginResponse login(LoginRequest request) {

        User existingUser = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), existingUser.getPassword())) {
            throw new UnauthorizedException("Invalid credentials");
        }

        String token = jwtUtil.generateToken(request.getUsername());

        return new LoginResponse(token);
    }
}