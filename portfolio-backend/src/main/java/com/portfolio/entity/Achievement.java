package com.portfolio.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "achievements")
public class Achievement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(name = "associated_date")
    private String associatedDate;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "media_url")
    private String mediaUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_id", nullable = false)
    private Profile profile;

    public Achievement() {}

    public Achievement(Long id, String title, String associatedDate, String description, String mediaUrl, Profile profile) {
        this.id = id;
        this.title = title;
        this.associatedDate = associatedDate;
        this.description = description;
        this.mediaUrl = mediaUrl;
        this.profile = profile;
    }

    public static AchievementBuilder builder() {
        return new AchievementBuilder();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getAssociatedDate() { return associatedDate; }
    public void setAssociatedDate(String associatedDate) { this.associatedDate = associatedDate; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getMediaUrl() { return mediaUrl; }
    public void setMediaUrl(String mediaUrl) { this.mediaUrl = mediaUrl; }

    public Profile getProfile() { return profile; }
    public void setProfile(Profile profile) { this.profile = profile; }

    @Override
    public String toString() {
        return "Achievement{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", associatedDate='" + associatedDate + '\'' +
                ", description='" + description + '\'' +
                ", mediaUrl='" + mediaUrl + '\'' +
                '}';
    }

    // Manual Builder
    public static class AchievementBuilder {
        private Long id;
        private String title;
        private String associatedDate;
        private String description;
        private String mediaUrl;
        private Profile profile;

        public AchievementBuilder id(Long id) { this.id = id; return this; }
        public AchievementBuilder title(String title) { this.title = title; return this; }
        public AchievementBuilder associatedDate(String associatedDate) { this.associatedDate = associatedDate; return this; }
        public AchievementBuilder description(String description) { this.description = description; return this; }
        public AchievementBuilder mediaUrl(String mediaUrl) { this.mediaUrl = mediaUrl; return this; }
        public AchievementBuilder profile(Profile profile) { this.profile = profile; return this; }

        public Achievement build() {
            return new Achievement(id, title, associatedDate, description, mediaUrl, profile);
        }
    }
}
