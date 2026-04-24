##
## Build stage
##
FROM maven:3.9-eclipse-temurin-17-alpine AS build
WORKDIR /workspace

COPY pom.xml .
RUN mvn -q -DskipTests dependency:go-offline

COPY src ./src
RUN mvn -q -DskipTests package

##
## Runtime stage
##
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

RUN addgroup -S app && adduser -S app -G app

# Copy the built jar (single artifact) from the build stage
COPY --from=build /workspace/target/*.jar /app/app.jar

USER app
EXPOSE 8080

# Let container/platform provide memory limits; use modern defaults
ENTRYPOINT ["java","-XX:MaxRAMPercentage=75.0","-XX:InitialRAMPercentage=25.0","-Djava.security.egd=file:/dev/./urandom","-jar","/app/app.jar"]