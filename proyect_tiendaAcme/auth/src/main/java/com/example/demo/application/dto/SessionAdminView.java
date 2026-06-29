package com.example.demo.application.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SessionAdminView {
    private Long id;
    private String tokenPreview;
    private String userEmail;
    private LocalDateTime expiryDate;
}
