package com.example.demo.domain.models;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RefreshToken {
    private Long id;
    private String token;
    private Long userId;
    private LocalDateTime expiryDate;
    private boolean revoked;

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiryDate);
    }
}
