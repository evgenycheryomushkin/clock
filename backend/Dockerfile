FROM adoptopenjdk/openjdk11 AS build
WORKDIR /home/
COPY gradle/ ./gradle/
COPY gradlew build.gradle settings.gradle ./
RUN ls -la
RUN chmod a+x gradlew
RUN ./gradlew dependencies
COPY src/ ./src/
RUN ls  -la
RUN ./gradlew installShadowDist

FROM flink:1.17.1-scala_2.12-java11
COPY --from=build /home/build/libs/clock-backend-0.1-SNAPSHOT-all.jar /opt/flink/usrlib/clock.jar
