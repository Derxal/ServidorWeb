package com.example.demo.domain.models;

import lombok.*;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class User {
    private Long id;
    private String name;
    private String lastName;
    private String email;
    private String password;
    private Role role;
    private boolean active;
}
