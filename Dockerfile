# Stage 1: Build the application
FROM gradle:8.3.0-jdk17 AS build
WORKDIR /app
COPY /app/build.gradle.kts ./
COPY settings.gradle.kts ../settings.gradle.kts
COPY /app/src ./src
RUN gradle clean build

# Stage 2: Run the application
FROM eclipse-temurin:17.0.10_7-jre-jammy
WORKDIR /app
COPY --from=build /app/build/libs/shadow-all.jar app.jar
EXPOSE 4567

# Run the application
CMD ["java", "-jar", "app.jar"]
