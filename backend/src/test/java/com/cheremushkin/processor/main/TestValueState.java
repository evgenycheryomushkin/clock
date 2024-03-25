package com.cheremushkin.processor.main;

import org.apache.flink.api.common.state.ValueState;

import java.io.IOException;

public class TestValueState<T> implements ValueState<T> {
    T value = null;
    @Override
    public T value() throws IOException {
        return value;
    }

    @Override
    public void update(T value) throws IOException {
        this.value = value;
    }

    @Override
    public void clear() {
        this.value = null;
    }
}
