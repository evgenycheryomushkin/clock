package com.cheremushkin.main;

import com.cheremushkin.data.Card;
import lombok.Builder;
import lombok.Data;

import java.time.ZonedDateTime;
import java.util.HashMap;
import java.util.Map;

@Data
@Builder
public class Session {
    ZonedDateTime createDate;
    Map<String, Card> activeCards;
    Map<String, Card> doneCards;

    public static CustomSessionBuilder builder() {
        return new CustomSessionBuilder();
    }

    public static class CustomSessionBuilder extends SessionBuilder {
        @Override
        public Session build() {
            if (super.createDate == null) super.createDate = ZonedDateTime.now();
            return super.build();
        }
    }

}
