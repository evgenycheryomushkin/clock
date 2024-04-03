package com.cheremushkin.event;

import com.cheremushkin.exception.ClockEventException;
import com.cheremushkin.serializer.ClockEventSerializer;
import com.esotericsoftware.kryo.DefaultSerializer;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NonNull;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@Getter
@DefaultSerializer(ClockEventSerializer.class)
public class ClockEvent {
    final String type;
    Long createDate;
    final String sessionKey;
    Map<String, String> data;

    @JsonCreator
    public ClockEvent(
            @JsonProperty("type")       @NonNull String type,
            @JsonProperty("createDate") @NonNull Long createDate,
            @JsonProperty("sessionKey") @NonNull String sessionKey,
            @JsonProperty("data")       @NonNull Map<String, String> data) throws ClockEventException {
        this.type = type;
        if (dateValid(createDate)) throw new ClockEventException("Invalid time in milliseconds: "+createDate);
        this.createDate = createDate;
        //TODO validate session key
        this.sessionKey = sessionKey;
        this.data = data;
    }

    private boolean dateValid(Long createDate) {
        long time2024_01_01millis = 1704067200000L;
        return createDate > time2024_01_01millis;
    }

    private ClockEvent(@NonNull String type, String sessionKey) {
        this.type = type;
        this.createDate = System.currentTimeMillis();
        this.sessionKey = sessionKey;
        this.data = new HashMap<>();
    }

    public ClockEvent add(String key, String value) {
        data.put(key, value);
        return this;
    }
    public String get(String key) {
        return getData().get(key);
    }

    public String toString() {
        return "ClockEvent(type=" + this.getType() +
                ", createDate=" + this.getCreateDate() +
                ", sessionKey=" + this.getSessionKey() +
                ", data=[" + this.getData().entrySet().stream()
                .map(e -> e.getKey()+":"+e.getValue()).collect(Collectors.joining(","))+ "])";
    }

}
