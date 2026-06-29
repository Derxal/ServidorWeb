package com.example.demo.application.dto;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DashboardStats {
    private long totalUsers;
    private long activeUsers;
    private long activeSessions;
    private long adminCount;
}
