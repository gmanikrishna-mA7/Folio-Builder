package com.portfolio.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AchievementDTO(
    Long id,

    @NotBlank(message = "Achievement title is required")
    @Size(max = 255, message = "Achievement title must not exceed 255 characters")
    String title,

    String associatedDate,

    String description,

    String mediaUrl
) {}
