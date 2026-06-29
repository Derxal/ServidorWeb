package com.example.demo.infrastructure.controllers;

import com.example.demo.application.services.AdminService;
import com.example.demo.domain.models.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/login")
    public String loginPage() {
        return "admin/login";
    }

    @GetMapping({"/", "/dashboard"})
    public String dashboard(Model model) {
        model.addAttribute("stats", adminService.getDashboardStats());
        model.addAttribute("recentUsers", adminService.getAllUsers().stream().limit(5).toList());
        return "admin/dashboard";
    }

    @GetMapping("/users")
    public String users(Model model) {
        model.addAttribute("users", adminService.getAllUsers());
        return "admin/users";
    }

    @PostMapping("/users/{id}/role")
    public String changeRole(@PathVariable Long id, @RequestParam String role, RedirectAttributes ra) {
        adminService.changeRole(id, Role.valueOf(role));
        ra.addFlashAttribute("success", "Rol actualizado correctamente");
        return "redirect:/admin/users";
    }

    @PostMapping("/users/{id}/toggle")
    public String toggleActive(@PathVariable Long id, RedirectAttributes ra) {
        adminService.toggleActive(id);
        ra.addFlashAttribute("success", "Estado del usuario actualizado");
        return "redirect:/admin/users";
    }

    @PostMapping("/users/{id}/revoke-sessions")
    public String revokeSessions(@PathVariable Long id, RedirectAttributes ra) {
        adminService.revokeAllSessionsForUser(id);
        ra.addFlashAttribute("success", "Todas las sesiones han sido revocadas");
        return "redirect:/admin/users";
    }

    @GetMapping("/sessions")
    public String sessions(Model model) {
        model.addAttribute("sessions", adminService.getAllActiveSessions());
        return "admin/sessions";
    }

    @PostMapping("/sessions/{id}/revoke")
    public String revokeSession(@PathVariable Long id, RedirectAttributes ra) {
        adminService.revokeSession(id);
        ra.addFlashAttribute("success", "Sesión revocada");
        return "redirect:/admin/sessions";
    }
}
