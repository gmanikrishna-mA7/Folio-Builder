# Step 1: Build the application using Maven
FROM maven:3.8.5-openjdk-17 AS build
COPY . .

# 📁 Step into your exact backend folder
WORKDIR /portfolio-backend

RUN mvn clean package -DskipTests

# Step 2: Run the application using a stable Alpine Java 17 runtime
FROM eclipse-temurin:17-jre-alpine
COPY --from=build /portfolio-backend/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]