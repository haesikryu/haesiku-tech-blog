package com.haesiku.blog.controller;

import com.haesiku.blog.dto.CommentCreateRequestDto;
import com.haesiku.blog.dto.CommentPasswordDto;
import com.haesiku.blog.dto.CommentResponseDto;
import com.haesiku.blog.dto.CommentUpdateRequestDto;
import com.haesiku.blog.service.CommentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Comments", description = "게시글 댓글 API")
@RestController
@RequestMapping("/api/posts/{postId}/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @Operation(summary = "댓글 작성", description = "게시글에 댓글을 작성합니다. 비밀번호는 수정/삭제 시 사용합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "댓글 작성 성공",
                    content = @Content(schema = @Schema(implementation = CommentResponseDto.class))),
            @ApiResponse(responseCode = "400", description = "입력값 검증 실패"),
            @ApiResponse(responseCode = "404", description = "게시글을 찾을 수 없음")
    })
    @PostMapping
    public ResponseEntity<CommentResponseDto> createComment(
            @Parameter(description = "게시글 ID") @PathVariable Long postId,
            @Valid @RequestBody CommentCreateRequestDto request) {
        CommentResponseDto created = commentService.create(postId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @Operation(summary = "댓글 목록 조회", description = "게시글의 댓글 목록을 생성일시 순으로 조회합니다.")
    @ApiResponse(responseCode = "200", description = "댓글 목록 조회 성공")
    @GetMapping
    public ResponseEntity<List<CommentResponseDto>> getComments(
            @Parameter(description = "게시글 ID") @PathVariable Long postId) {
        return ResponseEntity.ok(commentService.findByPostId(postId));
    }

    @Operation(summary = "댓글 수정", description = "비밀번호 확인 후 댓글을 수정합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "댓글 수정 성공"),
            @ApiResponse(responseCode = "403", description = "비밀번호 불일치"),
            @ApiResponse(responseCode = "404", description = "댓글을 찾을 수 없음")
    })
    @PutMapping("/{commentId}")
    public ResponseEntity<CommentResponseDto> updateComment(
            @Parameter(description = "게시글 ID") @PathVariable Long postId,
            @Parameter(description = "댓글 ID") @PathVariable Long commentId,
            @Valid @RequestBody CommentUpdateRequestDto request) {
        return ResponseEntity.ok(commentService.update(postId, commentId, request));
    }

    @Operation(summary = "댓글 삭제", description = "비밀번호 확인 후 댓글을 삭제합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "댓글 삭제 성공"),
            @ApiResponse(responseCode = "403", description = "비밀번호 불일치"),
            @ApiResponse(responseCode = "404", description = "댓글을 찾을 수 없음")
    })
    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @Parameter(description = "게시글 ID") @PathVariable Long postId,
            @Parameter(description = "댓글 ID") @PathVariable Long commentId,
            @Valid @RequestBody CommentPasswordDto request) {
        commentService.delete(postId, commentId, request.password());
        return ResponseEntity.noContent().build();
    }
}
