package com.cheremushkin.data;

import com.cheremushkin.serializer.ClockEventSerializer;
import com.esotericsoftware.kryo.DefaultSerializer;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

import static com.cheremushkin.mapper.FrontendCardMapper.ERROR_EVENT;

@Getter
@Setter
@DefaultSerializer(ClockEventSerializer.class)
final public class ClockEvent {
    String type;
    Long createDate;
    String sessionKey;
    Map<String, String> data;

    @JsonCreator
    public ClockEvent(
            @JsonProperty("type")       @NonNull String type,
            @JsonProperty("createDate") @NonNull Long createDate,
            @JsonProperty("sessionKey") @NonNull String sessionKey,
            @JsonProperty("data")       @NonNull Map<String, String> data) {
        this.type = type;
        this.createDate = createDate;
        this.sessionKey = sessionKey;
        this.data = data;
    }

    public ClockEvent(@NonNull String type) {
        this.type = type;
        this.createDate = System.currentTimeMillis();
        this.sessionKey = "";
        this.data = new HashMap<>();
    }

    public static ClockEvent buildErrorEvent() {
        return new ClockEvent(ERROR_EVENT);
    }

    public ClockEvent add(String key, String value) {
        data.put(key, value);
        return this;
    }

    public ClockEvent addSessionKey(String sessionKey) {
        this.sessionKey = sessionKey;
        return this;
    }

    public String toString() {
        return "ClockEvent(type=" + this.getType() +
                ", createDate=" + this.getCreateDate() +
                ", sessionKey=" + this.getSessionKey() +
                ", data=[" + this.getData().entrySet().stream()
                .map(e -> e.getKey()+":"+e.getValue()).collect(Collectors.joining(","))+ "])";
    }
}
