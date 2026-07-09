package com.portfolio.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ProjectDTO(
    Long id,

    @NotBlank(message = "Project title is required")
    @Size(max = 255, message = "Project title must not exceed 255 characters")
    String title,

    @NotBlank(message = "Project description is required")
    String description,

    @NotBlank(message = "Tech stack is required")
    String techStack,

    String githubLink,
    
    String liveLink
) {}
