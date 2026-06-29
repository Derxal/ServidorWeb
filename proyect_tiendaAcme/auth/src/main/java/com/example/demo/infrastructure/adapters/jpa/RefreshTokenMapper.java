package com.example.demo.infrastructure.adapters.jpa;

import com.example.demo.domain.models.RefreshToken;
import com.example.demo.infrastructure.adapters.entity.RefreshTokenEntity;
import org.springframework.stereotype.Service;

@Service
public class RefreshTokenMapper {

    public RefreshToken toDomain(RefreshTokenEntity entity) {
        return RefreshToken.builder()
                .id(entity.getId())
                .token(entity.getToken())
                .userId(entity.getUserId())
                .expiryDate(entity.getExpiryDate())
                .revoked(entity.isRevoked())
                .build();
    }

    public RefreshTokenEntity toEntity(RefreshToken token) {
        return RefreshTokenEntity.builder()
                .id(token.getId())
                .token(token.getToken())
                .userId(token.getUserId())
                .expiryDate(token.getExpiryDate())
                .revoked(token.isRevoked())
                .build();
    }
}
