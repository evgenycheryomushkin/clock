package com.cheremushkin.data;

import com.cheremushkin.serializer.SessionSerializer;
import com.esotericsoftware.kryo.DefaultSerializer;
import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@DefaultSerializer(SessionSerializer.class)
public class Session {
    
    Long createDate;
    String sessionKey;

    public Session(@NonNull String sessionKey) {
        this.sessionKey = sessionKey;
        this.createDate = System.currentTimeMillis();
    }

    public Session(@NonNull String sessionKey, @NonNull Long createDate) {
        this.sessionKey = sessionKey;
        this.createDate = createDate;
    }
}
