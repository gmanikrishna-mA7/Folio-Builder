# ─── Stage 1: Build backend JAR ─────────────────────────────────────
FROM maven:3.9.6-eclipse-temurin-17 AS build

WORKDIR /app

# Copy backend source
COPY portfolio-backend/pom.xml ./pom.xml
COPY portfolio-backend/src ./src

# Build the JAR (skip tests for Docker build speed)
RUN mvn clean package -DskipTests

# ─── Stage 2: Lean runtime image ────────────────────────────────────
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copy built JAR from build stage
COPY --from=build /app/target/*.jar app.jar

# Create uploads directory for file persistence
RUN mkdir -p /app/uploads

# Expose backend port
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]