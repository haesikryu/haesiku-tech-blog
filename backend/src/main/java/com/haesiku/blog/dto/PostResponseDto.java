package com.haesiku.blog.dto;

import com.haesiku.blog.entity.PostStatus;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;
import java.util.List;

@Schema(description = "게시글 응답")
public record PostResponseDto(
        @Schema(description = "게시글 ID", example = "1")
        Long id,

        @Schema(description = "제목", example = "Spring Boot 시작하기")
        String title,

        @Schema(description = "내용 (Markdown)", example = "# Spring Boot\nSpring Boot는 ...")
        String content,

        @Schema(description = "요약", example = "Spring Boot 입문 가이드")
        String summary,

        @Schema(description = "작성자", example = "haesiku")
        String author,

        @Schema(description = "URL slug", example = "spring-boot-sijaghagi")
        String slug,

        @Schema(description = "발행 상태", example = "PUBLISHED")
        PostStatus status,

        @Schema(description = "조회수", example = "42")
        Long viewCount,

        @Schema(description = "소속 카테고리")
        CategoryResponseDto category,

        @Schema(description = "태그 목록")
        List<TagResponseDto> tags,

        @Schema(description = "생성일시", example = "2025-01-15T10:30:00")
        LocalDateTime createdAt,

        @Schema(description = "수정일시", example = "2025-01-16T14:20:00")
        LocalDateTime updatedAt,

        @Schema(description = "발행일시", example = "2025-01-15T12:00:00")
        LocalDateTime publishedAt
) {
}
