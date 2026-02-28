package com.haesiku.blog.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

@Schema(description = "댓글 응답 (비밀번호 제외)")
public record CommentResponseDto(
        @Schema(description = "댓글 ID", example = "1")
        Long id,

        @Schema(description = "작성자", example = "방문자")
        String author,

        @Schema(description = "댓글 내용")
        String body,

        @Schema(description = "생성일시")
        LocalDateTime createdAt,

        @Schema(description = "수정일시")
        LocalDateTime updatedAt
) {
}
