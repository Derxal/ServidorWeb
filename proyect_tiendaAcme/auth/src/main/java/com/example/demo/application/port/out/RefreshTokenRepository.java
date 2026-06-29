package com.example.demo.application.port.out;

import com.example.demo.domain.models.RefreshToken;

import java.util.List;
import java.util.Optional;

public interface RefreshTokenRepository {
    RefreshToken save(RefreshToken token);
    Optional<RefreshToken> findByToken(String token);
    Optional<RefreshToken> findById(Long id);
    List<RefreshToken> findAllByUserId(Long userId);
    long countActive();
    void delete(RefreshToken token);
    void deleteById(Long id);
}
