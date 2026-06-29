package com.example.demo.infrastructure.adapters.jpa;

import com.example.demo.domain.models.Role;
import com.example.demo.infrastructure.adapters.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserJpaRepository extends JpaRepository<UserEntity, Long> {
    Optional<UserEntity> findByEmail(String email);
    boolean existsByEmail(String email);
    long countByRole(Role role);
    long countByActive(boolean active);
}
