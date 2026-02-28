package com.haesiku.common.util;

import java.text.Normalizer;
import java.util.regex.Pattern;

/**
 * 한글 제목을 URL-safe slug로 변환하는 유틸리티.
 * 한글 음절을 초성/중성/종성으로 분해하여 로마자로 변환한다.
 */
public final class SlugUtils {

    private SlugUtils() {
    }

    private static final int HANGUL_BASE = 0xAC00;
    private static final int HANGUL_END = 0xD7A3;
    private static final int CHO_COUNT = 19;
    private static final int JUNG_COUNT = 21;
    private static final int JONG_COUNT = 28;

    // 초성 (19개)
    private static final String[] CHO = {
            "g", "kk", "n", "d", "tt", "r", "m", "b", "pp",
            "s", "ss", "", "j", "jj", "ch", "k", "t", "p", "h"
    };

    // 중성 (21개)
    private static final String[] JUNG = {
            "a", "ae", "ya", "yae", "eo", "e", "yeo", "ye",
            "o", "wa", "wae", "oe", "yo", "u", "wo", "we",
            "wi", "yu", "eu", "ui", "i"
    };

    // 종성 (28개, 첫 번째는 종성 없음)
    private static final String[] JONG = {
            "", "k", "k", "k", "n", "n", "n", "t",
            "l", "l", "l", "l", "l", "l", "l", "l",
            "m", "p", "p", "s", "s", "ng", "j", "j",
            "ch", "k", "t", "p"
    };

    private static final Pattern NON_ALPHANUMERIC = Pattern.compile("[^a-z0-9\\-]");
    private static final Pattern MULTIPLE_HYPHENS = Pattern.compile("-{2,}");

    /**
     * 제목 문자열을 URL slug로 변환한다.
     * 한글은 로마자로 변환하고, 영문/숫자는 그대로 유지한다.
     *
     * @param input 변환할 문자열
     * @return URL-safe slug
     */
    public static String toSlug(String input) {
        if (input == null || input.isBlank()) {
            return "";
        }

        String romanized = romanize(input);

        String normalized = Normalizer.normalize(romanized, Normalizer.Form.NFD)
                .replaceAll("[\\p{InCombiningDiacriticalMarks}]", "");

        String slug = normalized.toLowerCase()
                .replace(' ', '-');

        slug = NON_ALPHANUMERIC.matcher(slug).replaceAll("");
        slug = MULTIPLE_HYPHENS.matcher(slug).replaceAll("-");
        slug = slug.replaceAll("^-|-$", "");

        return slug;
    }

    /**
     * 한글 문자열을 로마자로 변환한다.
     */
    private static String romanize(String input) {
        StringBuilder sb = new StringBuilder();

        for (int i = 0; i < input.length(); i++) {
            char ch = input.charAt(i);

            if (ch >= HANGUL_BASE && ch <= HANGUL_END) {
                int syllable = ch - HANGUL_BASE;
                int choIndex = syllable / (JUNG_COUNT * JONG_COUNT);
                int jungIndex = (syllable % (JUNG_COUNT * JONG_COUNT)) / JONG_COUNT;
                int jongIndex = syllable % JONG_COUNT;

                sb.append(CHO[choIndex]);
                sb.append(JUNG[jungIndex]);
                sb.append(JONG[jongIndex]);
            } else if (ch == ' ') {
                sb.append('-');
            } else {
                sb.append(ch);
            }
        }

        return sb.toString();
    }
}
