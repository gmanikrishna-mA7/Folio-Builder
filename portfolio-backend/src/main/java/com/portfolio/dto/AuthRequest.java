package com.portfolio.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record AuthRequest(
    @NotBlank(message = "Email must not be empty")
    @Email(message = "Invalid email format")
    String email,

    @NotBlank(message = "Password must not be empty")
    String password
) {}
