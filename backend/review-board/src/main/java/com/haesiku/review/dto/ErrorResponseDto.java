package com.haesiku.review.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;
import java.util.List;

@Schema(description = "에러 응답")
public record ErrorResponseDto(
        @Schema(description = "HTTP 상태 코드", example = "400")
        int status,

        @Schema(description = "에러 메시지", example = "입력값 검증에 실패했습니다")
        String message,

        @Schema(description = "상세 에러 목록", example = "[\"title: 제목은 필수입니다\"]")
        List<String> errors,

        @Schema(description = "발생 시각", example = "2025-01-15T10:30:00")
        LocalDateTime timestamp
) {
    public ErrorResponseDto(int status, String message) {
        this(status, message, List.of(), LocalDateTime.now());
    }

    public ErrorResponseDto(int status, String message, List<String> errors) {
        this(status, message, errors, LocalDateTime.now());
    }
}
