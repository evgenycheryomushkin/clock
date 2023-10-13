FROM gradle:7.4 as gradleBuild
COPY --chown=gradle:gradle build.gradle /home/gradle/
COPY --chown=gradle:gradle settings.gradle /home/gradle/
RUN gradle dependencies
COPY --chown=gradle:gradle src/ /home/gradle/src/
WORKDIR /home/gradle
RUN gradle clean installShadowDist --no-daemon

FROM flink:1.17.1-scala_2.12-java11
COPY --from=gradleBuild /home/gradle/build/libs/clock-backend-0.1-SNAPSHOT-all.jar  /opt/ClockJob.jar
