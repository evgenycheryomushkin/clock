package com.cheremushkin.validate;

import lombok.Builder;
import lombok.Data;

import java.time.ZonedDateTime;

@Data
public class KeyInfo {
    public KeyInfo() {
        created = ZonedDateTime.now();
        updated = created;
    }
    ZonedDateTime created;
    ZonedDateTime updated;
}
