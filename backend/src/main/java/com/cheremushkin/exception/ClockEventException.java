package com.cheremushkin.exception;

public class ClockEventException extends Exception {

    public ClockEventException(String type) {
        super(type);
    }

    public static ClockEventException buildInvalidTypeException(String type) {
        return new ClockEventException("Invalid type: " + type);
    }
}
