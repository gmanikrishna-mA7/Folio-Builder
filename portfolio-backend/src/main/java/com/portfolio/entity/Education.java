package com.portfolio.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "education")
public class Education {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "degree_name", nullable = false)
    private String degreeName;

    @Column(nullable = false)
    private String institution;

    @Column(nullable = false)
    private String timeline;

    @Column(name = "grade_or_cgpa")
    private String gradeOrCgpa;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_id", nullable = false)
    private Profile profile;

    public Education() {}

    public Education(Long id, String degreeName, String institution, String timeline, String gradeOrCgpa, Profile profile) {
        this.id = id;
        this.degreeName = degreeName;
        this.institution = institution;
        this.timeline = timeline;
        this.gradeOrCgpa = gradeOrCgpa;
        this.profile = profile;
    }

    public static EducationBuilder builder() {
        return new EducationBuilder();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDegreeName() { return degreeName; }
    public void setDegreeName(String degreeName) { this.degreeName = degreeName; }

    public String getInstitution() { return institution; }
    public void setInstitution(String institution) { this.institution = institution; }

    public String getTimeline() { return timeline; }
    public void setTimeline(String timeline) { this.timeline = timeline; }

    public String getGradeOrCgpa() { return gradeOrCgpa; }
    public void setGradeOrCgpa(String gradeOrCgpa) { this.gradeOrCgpa = gradeOrCgpa; }

    public Profile getProfile() { return profile; }
    public void setProfile(Profile profile) { this.profile = profile; }

    @Override
    public String toString() {
        return "Education{" +
                "id=" + id +
                ", degreeName='" + degreeName + '\'' +
                ", institution='" + institution + '\'' +
                ", timeline='" + timeline + '\'' +
                ", gradeOrCgpa='" + gradeOrCgpa + '\'' +
                '}';
    }

    // Manual Builder
    public static class EducationBuilder {
        private Long id;
        private String degreeName;
        private String institution;
        private String timeline;
        private String gradeOrCgpa;
        private Profile profile;

        public EducationBuilder id(Long id) { this.id = id; return this; }
        public EducationBuilder degreeName(String degreeName) { this.degreeName = degreeName; return this; }
        public EducationBuilder institution(String institution) { this.institution = institution; return this; }
        public EducationBuilder timeline(String timeline) { this.timeline = timeline; return this; }
        public EducationBuilder gradeOrCgpa(String gradeOrCgpa) { this.gradeOrCgpa = gradeOrCgpa; return this; }
        public EducationBuilder profile(Profile profile) { this.profile = profile; return this; }

        public Education build() {
            return new Education(id, degreeName, institution, timeline, gradeOrCgpa, profile);
        }
    }
}
