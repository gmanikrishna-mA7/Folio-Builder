-- PostgreSQL DDL Script for Folio platform

-- Drop tables if they exist to support clean environment rebuilds
DROP TABLE IF EXISTS achievements CASCADE;
DROP TABLE IF EXISTS education CASCADE;
DROP TABLE IF EXISTS certificates CASCADE;
DROP TABLE IF EXISTS experiences CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS skills CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. Users Table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL
);

-- 2. Profiles Table (One User can own Multiple Profiles. Removed UNIQUE constraint from user_id)
CREATE TABLE profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    bio TEXT,
    profile_image_url VARCHAR(512),
    resume_url VARCHAR(512),
    github_link VARCHAR(512),
    linkedin_link VARCHAR(512),
    slug VARCHAR(255) NOT NULL UNIQUE,
    background_color VARCHAR(50),
    roles VARCHAR(512),
    email VARCHAR(255),
    phone VARCHAR(50),
    font_family VARCHAR(50) DEFAULT 'sans',
    CONSTRAINT fk_profile_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Skills Table
CREATE TABLE skills (
    id BIGSERIAL PRIMARY KEY,
    profile_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    CONSTRAINT fk_skill_profile FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- 4. Projects Table
CREATE TABLE projects (
    id BIGSERIAL PRIMARY KEY,
    profile_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    tech_stack VARCHAR(512) NOT NULL,
    github_link VARCHAR(512),
    live_link VARCHAR(512),
    CONSTRAINT fk_project_profile FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- 5. Experiences Table
CREATE TABLE experiences (
    id BIGSERIAL PRIMARY KEY,
    profile_id BIGINT NOT NULL,
    company VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    start_date VARCHAR(50) NOT NULL,
    end_date VARCHAR(50),
    description TEXT,
    CONSTRAINT fk_experience_profile FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- 6. Certificates Table (extended with description + file_path)
CREATE TABLE certificates (
    id BIGSERIAL PRIMARY KEY,
    profile_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    issuing_organization VARCHAR(255) NOT NULL,
    issue_date VARCHAR(50),
    credential_url VARCHAR(512),
    description TEXT,
    file_path VARCHAR(512),
    CONSTRAINT fk_certificate_profile FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- 7. Education Table
CREATE TABLE education (
    id BIGSERIAL PRIMARY KEY,
    profile_id BIGINT NOT NULL,
    degree_name VARCHAR(255) NOT NULL,
    institution VARCHAR(255) NOT NULL,
    timeline VARCHAR(100) NOT NULL,
    grade_or_cgpa VARCHAR(50),
    CONSTRAINT fk_education_profile FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- 8. Achievements Table (NEW)
CREATE TABLE achievements (
    id BIGSERIAL PRIMARY KEY,
    profile_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    associated_date VARCHAR(100),
    description TEXT,
    media_url VARCHAR(512),
    CONSTRAINT fk_achievement_profile FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- Optimize Query Performance with Indexes
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_slug ON profiles(slug); -- High-speed dynamic routing index
CREATE INDEX idx_skills_profile_id ON skills(profile_id);
CREATE INDEX idx_projects_profile_id ON projects(profile_id);
CREATE INDEX idx_experiences_profile_id ON experiences(profile_id);
CREATE INDEX idx_certificates_profile_id ON certificates(profile_id);
CREATE INDEX idx_education_profile_id ON education(profile_id);
CREATE INDEX idx_achievements_profile_id ON achievements(profile_id);
