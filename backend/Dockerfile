FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -q
COPY src ./src
RUN mvn package -Dmaven.test.skip=true -q

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

RUN echo '#!/bin/sh' > entrypoint.sh && \
    echo 'exec java $JAVA_OPTS -jar app.jar \
    --spring.data.mongodb.host=mongodb \
    --spring.data.mongodb.port=27017 \
    --spring.data.mongodb.database=benua \
    --spring.data.mongodb.username=admin \
    --spring.data.mongodb.password=benuaadmin \
    --spring.data.mongodb.authentication-database=admin' >> entrypoint.sh && \
    chmod +x entrypoint.sh

EXPOSE 8080

ENTRYPOINT ["./entrypoint.sh"]
# ENTRYPOINT ["java", "-jar", "app.jar"]
