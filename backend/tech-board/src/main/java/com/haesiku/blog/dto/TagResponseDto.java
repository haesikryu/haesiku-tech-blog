package com.haesiku.blog.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

@Schema(description = "태그 응답")
public record TagResponseDto(
        @Schema(description = "태그 ID", example = "1")
        Long id,

        @Schema(description = "태그 이름", example = "Java")
        String name,

        @Schema(description = "URL slug", example = "java")
        String slug,

        @Schema(description = "생성일시", example = "2025-01-10T09:00:00")
        LocalDateTime createdAt
) {
}
