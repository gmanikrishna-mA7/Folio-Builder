package com.portfolio.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CertificateDTO(
    Long id,

    @NotBlank(message = "Certificate name is required")
    @Size(max = 255, message = "Certificate name must not exceed 255 characters")
    String name,

    @NotBlank(message = "Issuing organization is required")
    @Size(max = 255, message = "Issuing organization must not exceed 255 characters")
    String issuingOrganization,

    String issueDate,

    String credentialUrl,

    String description,

    String filePath
) {}
