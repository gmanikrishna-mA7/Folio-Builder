package com.portfolio.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "certificates")
public class Certificate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "issuing_organization", nullable = false)
    private String issuingOrganization;

    @Column(name = "issue_date")
    private String issueDate;

    @Column(name = "credential_url")
    private String credentialUrl;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "file_path")
    private String filePath;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_id", nullable = false)
    private Profile profile;

    public Certificate() {}

    public Certificate(Long id, String name, String issuingOrganization, String issueDate,
                       String credentialUrl, String description, String filePath, Profile profile) {
        this.id = id;
        this.name = name;
        this.issuingOrganization = issuingOrganization;
        this.issueDate = issueDate;
        this.credentialUrl = credentialUrl;
        this.description = description;
        this.filePath = filePath;
        this.profile = profile;
    }

    public static CertificateBuilder builder() {
        return new CertificateBuilder();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getIssuingOrganization() { return issuingOrganization; }
    public void setIssuingOrganization(String issuingOrganization) { this.issuingOrganization = issuingOrganization; }

    public String getIssueDate() { return issueDate; }
    public void setIssueDate(String issueDate) { this.issueDate = issueDate; }

    public String getCredentialUrl() { return credentialUrl; }
    public void setCredentialUrl(String credentialUrl) { this.credentialUrl = credentialUrl; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }

    public Profile getProfile() { return profile; }
    public void setProfile(Profile profile) { this.profile = profile; }

    @Override
    public String toString() {
        return "Certificate{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", issuingOrganization='" + issuingOrganization + '\'' +
                ", issueDate='" + issueDate + '\'' +
                ", credentialUrl='" + credentialUrl + '\'' +
                ", description='" + description + '\'' +
                ", filePath='" + filePath + '\'' +
                '}';
    }

    // Manual Builder
    public static class CertificateBuilder {
        private Long id;
        private String name;
        private String issuingOrganization;
        private String issueDate;
        private String credentialUrl;
        private String description;
        private String filePath;
        private Profile profile;

        public CertificateBuilder id(Long id) { this.id = id; return this; }
        public CertificateBuilder name(String name) { this.name = name; return this; }
        public CertificateBuilder issuingOrganization(String issuingOrganization) { this.issuingOrganization = issuingOrganization; return this; }
        public CertificateBuilder issueDate(String issueDate) { this.issueDate = issueDate; return this; }
        public CertificateBuilder credentialUrl(String credentialUrl) { this.credentialUrl = credentialUrl; return this; }
        public CertificateBuilder description(String description) { this.description = description; return this; }
        public CertificateBuilder filePath(String filePath) { this.filePath = filePath; return this; }
        public CertificateBuilder profile(Profile profile) { this.profile = profile; return this; }

        public Certificate build() {
            return new Certificate(id, name, issuingOrganization, issueDate, credentialUrl, description, filePath, profile);
        }
    }
}
