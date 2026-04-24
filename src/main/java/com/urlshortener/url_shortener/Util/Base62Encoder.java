package com.urlshortener.url_shortener.Util;

public class Base62Encoder {

    private static final String BASE62 = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    public static String encode(long value) {
        StringBuilder result = new StringBuilder();

        while (value > 0) {
            int remainder = (int) (value % 62);
            result.append(BASE62.charAt(remainder));
            value /= 62;
        }

        return result.reverse().toString();
    }
}