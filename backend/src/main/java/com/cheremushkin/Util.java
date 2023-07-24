package com.cheremushkin;

public class Util {
    /**
     * Generate new key or id. Key consists of 8 hex digits.
     * @return new key or id, that contains 8 hex digits.
     */
    public static String generate() {
        return Integer.toHexString((int) (Math.random()*(4 << 8)));
    }

}
