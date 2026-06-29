package com.example.demo.application.dto;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserAdminView {
    private Long id;
    private String name;
    private String lastName;
    private String email;
    private String role;
    private boolean active;
    private long activeSessions;
}
