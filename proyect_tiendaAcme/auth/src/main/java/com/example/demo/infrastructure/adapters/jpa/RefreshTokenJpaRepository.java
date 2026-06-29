package com.example.demo.infrastructure.adapters.jpa;

import com.example.demo.infrastructure.adapters.entity.RefreshTokenEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface RefreshTokenJpaRepository extends JpaRepository<RefreshTokenEntity, Long> {
    Optional<RefreshTokenEntity> findByToken(String token);
    List<RefreshTokenEntity> findAllByUserId(Long userId);
    void deleteByToken(String token);

    @Query("SELECT COUNT(r) FROM RefreshTokenEntity r WHERE r.revoked = false AND r.expiryDate > :now")
    long countActive(LocalDateTime now);
}
