FROM gradle:7.4 as gradleBuild
COPY --chown=gradle:gradle src/ /home/gradle/
COPY --chown=gradle:gradle build.gradle /home/gradle/
COPY --chown=gradle:gradle settings.gradle /home/gradle/
WORKDIR /home/gradle
RUN gradle clean shadowJar --no-daemon

FROM flink:1.17.1
COPY --from=gradleBuild /home/gradle/build/libs/*all.jar /opt/flink/usr/lib/
