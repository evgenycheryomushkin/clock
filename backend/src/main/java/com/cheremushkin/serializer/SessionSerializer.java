package com.cheremushkin.serializer;

import com.cheremushkin.data.Session;
import com.esotericsoftware.kryo.Kryo;
import com.esotericsoftware.kryo.Serializer;
import com.esotericsoftware.kryo.io.Input;
import com.esotericsoftware.kryo.io.Output;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class SessionSerializer extends Serializer<Session> {

    static final String V1 = "SESSION_KRYO_V1_2023-10-01";

    @Override
    public void write(Kryo kryo, Output output, Session session) {
        log.info("write session {}", session);
        output.writeString(V1);
        output.writeString(session.getSessionKey());
        output.writeLong(session.getCreateDate());
    }

    @Override
    public Session read(Kryo kryo, Input input, Class<Session> type) {
        String version = input.readString();
        String sessionKey = input.readString();
        Long createDate = input.readLong();
        Session session = new Session(sessionKey, createDate);
        log.info("read session {}", session);
        return session;
    }
}
