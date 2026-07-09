package com.portfolio.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "experiences")
public class Experience {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String company;

    @Column(nullable = false)
    private String role;

    @Column(name = "start_date", nullable = false)
    private String startDate;

    @Column(name = "end_date")
    private String endDate;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "media_url")
    private String mediaUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_id", nullable = false)
    private Profile profile;

    public Experience() {}

    public Experience(Long id, String company, String role, String startDate, String endDate, String description, String mediaUrl, Profile profile) {
        this.id = id;
        this.company = company;
        this.role = role;
        this.startDate = startDate;
        this.endDate = endDate;
        this.description = description;
        this.mediaUrl = mediaUrl;
        this.profile = profile;
    }

    public static ExperienceBuilder builder() {
        return new ExperienceBuilder();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getStartDate() { return startDate; }
    public void setStartDate(String startDate) { this.startDate = startDate; }

    public String getEndDate() { return endDate; }
    public void setEndDate(String endDate) { this.endDate = endDate; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getMediaUrl() { return mediaUrl; }
    public void setMediaUrl(String mediaUrl) { this.mediaUrl = mediaUrl; }

    public Profile getProfile() { return profile; }
    public void setProfile(Profile profile) { this.profile = profile; }

    @Override
    public String toString() {
        return "Experience{" +
                "id=" + id +
                ", company='" + company + '\'' +
                ", role='" + role + '\'' +
                ", startDate='" + startDate + '\'' +
                ", endDate='" + endDate + '\'' +
                ", description='" + description + '\'' +
                ", mediaUrl='" + mediaUrl + '\'' +
                '}';
    }

    // Manual Builder
    public static class ExperienceBuilder {
        private Long id;
        private String company;
        private String role;
        private String startDate;
        private String endDate;
        private String description;
        private String mediaUrl;
        private Profile profile;

        public ExperienceBuilder id(Long id) { this.id = id; return this; }
        public ExperienceBuilder company(String company) { this.company = company; return this; }
        public ExperienceBuilder role(String role) { this.role = role; return this; }
        public ExperienceBuilder startDate(String startDate) { this.startDate = startDate; return this; }
        public ExperienceBuilder endDate(String endDate) { this.endDate = endDate; return this; }
        public ExperienceBuilder description(String description) { this.description = description; return this; }
        public ExperienceBuilder mediaUrl(String mediaUrl) { this.mediaUrl = mediaUrl; return this; }
        public ExperienceBuilder profile(Profile profile) { this.profile = profile; return this; }

        public Experience build() {
            return new Experience(id, company, role, startDate, endDate, description, mediaUrl, profile);
        }
    }
}
