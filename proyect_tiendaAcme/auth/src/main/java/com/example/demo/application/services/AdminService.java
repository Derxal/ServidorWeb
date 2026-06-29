package com.example.demo.application.services;

import com.example.demo.application.dto.DashboardStats;
import com.example.demo.application.dto.SessionAdminView;
import com.example.demo.application.dto.UserAdminView;
import com.example.demo.application.port.out.RefreshTokenRepository;
import com.example.demo.application.port.out.UserRepository;
import com.example.demo.domain.models.RefreshToken;
import com.example.demo.domain.models.Role;
import com.example.demo.domain.models.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;

    public DashboardStats getDashboardStats() {
        return DashboardStats.builder()
                .totalUsers(userRepository.findAll().size())
                .activeUsers(userRepository.countByActive(true))
                .activeSessions(refreshTokenRepository.countActive())
                .adminCount(userRepository.countByRole(Role.ADMIN))
                .build();
    }

    public List<UserAdminView> getAllUsers() {
        return userRepository.findAll().stream().map(user -> {
            long sessions = refreshTokenRepository.findAllByUserId(user.getId()).stream()
                    .filter(t -> !t.isRevoked() && !t.isExpired())
                    .count();
            return UserAdminView.builder()
                    .id(user.getId())
                    .name(user.getName())
                    .lastName(user.getLastName())
                    .email(user.getEmail())
                    .role(user.getRole().name())
                    .active(user.isActive())
                    .activeSessions(sessions)
                    .build();
        }).toList();
    }

    public void changeRole(Long userId, Role newRole) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
        userRepository.save(User.builder()
                .id(user.getId()).name(user.getName()).lastName(user.getLastName())
                .email(user.getEmail()).password(user.getPassword())
                .role(newRole).active(user.isActive()).build());
    }

    public void toggleActive(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
        userRepository.save(User.builder()
                .id(user.getId()).name(user.getName()).lastName(user.getLastName())
                .email(user.getEmail()).password(user.getPassword())
                .role(user.getRole()).active(!user.isActive()).build());
    }

    public void revokeAllSessionsForUser(Long userId) {
        refreshTokenRepository.findAllByUserId(userId)
                .forEach(refreshTokenRepository::delete);
    }

    public List<SessionAdminView> getAllActiveSessions() {
        return userRepository.findAll().stream().flatMap(user ->
            refreshTokenRepository.findAllByUserId(user.getId()).stream()
                    .filter(t -> !t.isRevoked() && !t.isExpired())
                    .map(t -> new SessionAdminView(t.getId(), truncate(t.getToken()), user.getEmail(), t.getExpiryDate()))
        ).toList();
    }

    public void revokeSession(Long sessionId) {
        RefreshToken token = refreshTokenRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Sesión no encontrada"));
        refreshTokenRepository.delete(token);
    }

    private String truncate(String token) {
        return token.length() > 12 ? token.substring(0, 6) + "..." + token.substring(token.length() - 4) : token;
    }
}
