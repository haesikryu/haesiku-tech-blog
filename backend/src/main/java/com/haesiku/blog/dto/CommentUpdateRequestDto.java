package com.haesiku.blog.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(description = "댓글 수정 요청 (비밀번호로 본인 확인)")
public record CommentUpdateRequestDto(
        @Schema(description = "수정 시 사용할 비밀번호", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotBlank(message = "비밀번호를 입력해 주세요.")
        String password,

        @Schema(description = "수정할 댓글 내용", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotBlank(message = "댓글 내용을 입력해 주세요.")
        @Size(max = 2000, message = "댓글은 2000자 이하여야 합니다.")
        String body
) {
}
