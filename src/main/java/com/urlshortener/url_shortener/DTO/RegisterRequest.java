package com.urlshortener.url_shortener.DTO;

import lombok.Data;

@Data
public class RegisterRequest {
    private String username;
    private String password;
}