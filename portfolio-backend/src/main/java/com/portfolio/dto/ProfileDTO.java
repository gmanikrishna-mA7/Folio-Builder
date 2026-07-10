package com.portfolio.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;

public record ProfileDTO(
    Long id,

    @NotBlank(message = "Name is required")
    @Size(max = 255, message = "Name must not exceed 255 characters")
    String name,

    @NotBlank(message = "Title is required")
    @Size(max = 255, message = "Title must not exceed 255 characters")
    String title,

    String bio,

    String profileImageUrl,

    String resumeUrl,

    String githubLink,

    String linkedinLink,

    String slug,

    String backgroundColor,

    String roles,

    String email,

    String phone,

    String fontFamily,

    String avatarAnimation,

    @Valid
    List<SkillDTO> skills,

    @Valid
    List<ProjectDTO> projects,

    @Valid
    List<ExperienceDTO> experiences,

    @Valid
    List<CertificateDTO> certificates,

    @Valid
    List<EducationDTO> educations,

    @Valid
    List<AchievementDTO> achievements
) {}
