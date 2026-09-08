.PHONY: help test build run docker-build docker-run clean

help:
	@echo "FluxLoad Java - Developer Tasks"
	@echo "  make test         Run JUnit test suite with Maven"
	@echo "  make build        Build executable JAR"
	@echo "  make run          Run Spring Boot application locally"
	@echo "  make docker-build Build Docker container image"
	@echo "  make docker-run   Run Docker container"

test:
	mvn test

build:
	mvn clean package -DskipTests

run:
	mvn spring-boot:run

docker-build:
	docker build -t fluxload:java .

docker-run:
	docker run -p 8080:8080 -v $(PWD)/uploads:/data fluxload:java

clean:
	mvn clean
