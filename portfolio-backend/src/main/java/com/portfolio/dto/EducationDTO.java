package com.portfolio.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record EducationDTO(
    Long id,

    @NotBlank(message = "Degree name is required")
    @Size(max = 255, message = "Degree name must not exceed 255 characters")
    String degreeName,

    @NotBlank(message = "Institution is required")
    @Size(max = 255, message = "Institution must not exceed 255 characters")
    String institution,

    @NotBlank(message = "Timeline / duration is required")
    @Size(max = 100, message = "Timeline must not exceed 100 characters")
    String timeline,

    @Size(max = 50, message = "Grade must not exceed 50 characters")
    String gradeOrCgpa
) {}
