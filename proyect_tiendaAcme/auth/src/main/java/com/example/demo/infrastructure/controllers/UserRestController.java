package com.example.demo.infrastructure.controllers;

import com.example.demo.application.dto.RoleChangeRequest;
import com.example.demo.application.dto.UserAdminView;
import com.example.demo.application.services.AdminService;
import com.example.demo.domain.models.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserRestController {

    private final AdminService adminService;

    @GetMapping
    public ResponseEntity<List<UserAdminView>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @PutMapping("/{id}/role")
    public ResponseEntity<Void> changeRole(@PathVariable Long id,
                                           @RequestBody RoleChangeRequest request) {
        adminService.changeRole(id, Role.valueOf(request.getRole()));
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/active")
    public ResponseEntity<Void> toggleActive(@PathVariable Long id) {
        adminService.toggleActive(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/sessions")
    public ResponseEntity<Void> revokeSessions(@PathVariable Long id) {
        adminService.revokeAllSessionsForUser(id);
        return ResponseEntity.noContent().build();
    }
}
