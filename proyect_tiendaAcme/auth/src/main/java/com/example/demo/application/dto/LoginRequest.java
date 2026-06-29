package com.example.demo.application.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;
}
