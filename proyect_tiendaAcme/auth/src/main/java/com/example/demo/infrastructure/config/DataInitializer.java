package com.example.demo.infrastructure.config;

import com.example.demo.application.port.out.PasswordEncoderPort;
import com.example.demo.application.port.out.UserRepository;
import com.example.demo.domain.models.Role;
import com.example.demo.domain.models.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer {

    private final UserRepository userRepository;
    private final PasswordEncoderPort passwordEncoder;

    @EventListener(ApplicationReadyEvent.class)
    public void init() {
        String encoded = passwordEncoder.encode("admin");

        userRepository.findByEmail("admin").ifPresentOrElse(
            existing -> {
                if (!passwordEncoder.matches("admin", existing.getPassword())) {
                    userRepository.save(User.builder()
                            .id(existing.getId())
                            .name(existing.getName())
                            .lastName(existing.getLastName())
                            .email(existing.getEmail())
                            .password(encoded)
                            .role(existing.getRole())
                            .active(existing.isActive())
                            .build());
                    log.info("Admin password reset to default.");
                }
            },
            () -> {
                userRepository.save(User.builder()
                        .name("Admin")
                        .lastName("Sistema")
                        .email("admin")
                        .password(encoded)
                        .role(Role.ADMIN)
                        .active(true)
                        .build());
                log.info("Default admin user created.");
            }
        );
    }
}
