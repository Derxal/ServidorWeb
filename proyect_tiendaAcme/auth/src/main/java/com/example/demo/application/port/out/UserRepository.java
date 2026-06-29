package com.example.demo.application.port.out;

import com.example.demo.domain.models.Role;
import com.example.demo.domain.models.User;

import java.util.List;
import java.util.Optional;

public interface UserRepository {
    Optional<User> findByEmail(String email);
    Optional<User> findById(Long id);
    User save(User user);
    boolean existsByEmail(String email);
    List<User> findAll();
    long countByRole(Role role);
    long countByActive(boolean active);
}
