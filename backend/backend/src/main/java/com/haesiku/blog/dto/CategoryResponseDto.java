package com.haesiku.blog.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

@Schema(description = "카테고리 응답")
public record CategoryResponseDto(
        @Schema(description = "카테고리 ID", example = "1")
        Long id,

        @Schema(description = "카테고리 이름", example = "Spring Framework")
        String name,

        @Schema(description = "URL slug", example = "spring-framework")
        String slug,

        @Schema(description = "카테고리 설명", example = "Spring 관련 기술 포스트")
        String description,

        @Schema(description = "생성일시", example = "2025-01-10T09:00:00")
        LocalDateTime createdAt
) {
}
