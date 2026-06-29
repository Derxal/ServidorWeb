package com.example.demo.domain.valueObjects;

public record Email(String value) {
    public Email {
        if (value == null || !value.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")) {
            throw new IllegalArgumentException("Email inválido: " + value);
        }
    }
}
