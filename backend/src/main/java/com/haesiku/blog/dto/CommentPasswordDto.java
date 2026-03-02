package com.haesiku.blog.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "댓글 삭제 시 비밀번호 확인")
public record CommentPasswordDto(
        @Schema(description = "삭제 시 사용할 비밀번호", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotBlank(message = "비밀번호를 입력해 주세요.")
        String password
) {
}
