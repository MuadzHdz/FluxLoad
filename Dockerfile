# Stage 1: Build JAR using Maven
FROM maven:3.9-eclipse-temurin-17 AS builder

WORKDIR /build

COPY pom.xml .
RUN mvn dependency:go-offline -B

COPY src ./src
RUN mvn clean package -DskipTests -B

# Stage 2: Minimal JRE runtime
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

RUN addgroup -S fluxload && adduser -S fluxload -G fluxload && \
    mkdir -p /data && chown -R fluxload:fluxload /data /app

COPY --from=builder /build/target/*.jar /app/fluxload.jar

USER fluxload
WORKDIR /data
VOLUME ["/data"]

EXPOSE 8080

ENV SERVER_PORT=8080

ENTRYPOINT ["java", "-jar", "/app/fluxload.jar", "-d", "/data", "-b", "0.0.0.0", "-p", "8080"]
