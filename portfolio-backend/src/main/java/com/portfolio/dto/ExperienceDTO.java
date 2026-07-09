package com.portfolio.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ExperienceDTO(
    Long id,

    @NotBlank(message = "Company is required")
    @Size(max = 255, message = "Company name must not exceed 255 characters")
    String company,

    @NotBlank(message = "Role is required")
    @Size(max = 255, message = "Role description must not exceed 255 characters")
    String role,

    @NotBlank(message = "Start date is required")
    String startDate,

    String endDate,

    String description,
    
    String mediaUrl
) {}
