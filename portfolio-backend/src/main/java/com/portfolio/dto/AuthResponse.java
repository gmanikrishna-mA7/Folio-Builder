package com.portfolio.dto;

public record AuthResponse(
    String token,
    String email,
    String role
) {}
