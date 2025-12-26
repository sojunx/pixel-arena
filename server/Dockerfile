# Stage 1: Building
FROM eclipse-temurin:25-jdk-alpine as builder
WORKDIR /app

COPY .mvn/ .mvn
COPY mvnw pom.xml ./

# Install dependencies
RUN ./mvnw dependency:go-offline

COPY src ./src

# Clean package
RUN ./mvnw clean package -DskipTests

# Stage 2: Run app
FROM eclipse-temurin:25-jdk-alpine
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
