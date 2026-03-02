package com.haesiku.blog.controller;

import com.haesiku.common.dto.ErrorResponseDto;
import com.haesiku.common.dto.PageResponseDto;
import com.haesiku.blog.dto.PostRequestDto;
import com.haesiku.blog.dto.PostResponseDto;
import com.haesiku.blog.service.PostService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Posts", description = "게시글 API")
@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @Operation(summary = "게시글 생성", description = "새 게시글을 생성합니다. 기본 상태는 DRAFT입니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "게시글 생성 성공",
                    content = @Content(schema = @Schema(implementation = PostResponseDto.class))),
            @ApiResponse(responseCode = "400", description = "입력값 검증 실패",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDto.class)))
    })
    @io.swagger.v3.oas.annotations.parameters.RequestBody(
            description = "게시글 생성 요청",
            required = true,
            content = @Content(examples = @ExampleObject(value = """
                    {
                      "title": "Spring Boot 시작하기",
                      "content": "# Spring Boot\\nSpring Boot는 ...",
                      "summary": "Spring Boot 입문 가이드",
                      "author": "haesiku",
                      "categoryId": 1,
                      "tagNames": ["Spring", "Java", "Backend"]
                    }
                    """)))
    @PostMapping
    public ResponseEntity<PostResponseDto> createPost(@Valid @RequestBody PostRequestDto request) {
        PostResponseDto response = postService.createPost(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(summary = "게시글 수정", description = "기존 게시글을 수정합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "게시글 수정 성공"),
            @ApiResponse(responseCode = "400", description = "입력값 검증 실패",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDto.class))),
            @ApiResponse(responseCode = "404", description = "게시글을 찾을 수 없음",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDto.class)))
    })
    @PutMapping("/{id}")
    public ResponseEntity<PostResponseDto> updatePost(
            @Parameter(description = "게시글 ID", example = "1") @PathVariable Long id,
            @Valid @RequestBody PostRequestDto request) {
        return ResponseEntity.ok(postService.updatePost(id, request));
    }

    @Operation(summary = "게시글 삭제", description = "게시글을 영구 삭제합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "게시글 삭제 성공"),
            @ApiResponse(responseCode = "404", description = "게시글을 찾을 수 없음",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDto.class)))
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(
            @Parameter(description = "게시글 ID", example = "1") @PathVariable Long id) {
        postService.deletePost(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "게시글 상세 조회", description = "slug로 게시글을 조회합니다. 조회 시 조회수가 1 증가합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "게시글 조회 성공"),
            @ApiResponse(responseCode = "404", description = "게시글을 찾을 수 없음",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDto.class)))
    })
    @GetMapping("/{slug}")
    public ResponseEntity<PostResponseDto> getPost(
            @Parameter(description = "게시글 slug", example = "spring-boot-sijaghagi") @PathVariable String slug) {
        return ResponseEntity.ok(postService.getPost(slug));
    }

    @Operation(summary = "발행된 게시글 목록 조회", description = "PUBLISHED 상태의 게시글을 페이지 단위로 조회합니다.")
    @ApiResponse(responseCode = "200", description = "게시글 목록 조회 성공")
    @GetMapping
    public ResponseEntity<PageResponseDto<PostResponseDto>> getPublishedPosts(
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC)
            Pageable pageable) {
        return ResponseEntity.ok(PageResponseDto.from(postService.getPublishedPosts(pageable)));
    }

    @Operation(summary = "게시글 검색", description = "제목 또는 내용에 키워드가 포함된 게시글을 검색합니다.")
    @ApiResponse(responseCode = "200", description = "검색 결과 조회 성공")
    @GetMapping("/search")
    public ResponseEntity<PageResponseDto<PostResponseDto>> searchPosts(
            @Parameter(description = "검색 키워드", example = "Spring") @RequestParam String keyword,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC)
            Pageable pageable) {
        return ResponseEntity.ok(PageResponseDto.from(postService.searchPosts(keyword, pageable)));
    }

    @Operation(summary = "게시글 발행 상태 토글", description = "DRAFT ↔ PUBLISHED 상태를 토글합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "상태 변경 성공"),
            @ApiResponse(responseCode = "404", description = "게시글을 찾을 수 없음",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDto.class)))
    })
    @PatchMapping("/{id}/publish")
    public ResponseEntity<PostResponseDto> publishPost(
            @Parameter(description = "게시글 ID", example = "1") @PathVariable Long id) {
        return ResponseEntity.ok(postService.publishPost(id));
    }

    @Operation(summary = "[관리자] 전체 게시글 목록", description = "DRAFT 포함 모든 게시글을 페이지 단위로 조회합니다.")
    @ApiResponse(responseCode = "200", description = "전체 게시글 목록 조회 성공")
    @GetMapping("/admin")
    public ResponseEntity<PageResponseDto<PostResponseDto>> getAllPosts(
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC)
            Pageable pageable) {
        return ResponseEntity.ok(PageResponseDto.from(postService.getAllPosts(pageable)));
    }

    @Operation(summary = "[관리자] ID로 게시글 조회", description = "게시글 ID로 조회합니다. 조회수가 증가하지 않습니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "게시글 조회 성공"),
            @ApiResponse(responseCode = "404", description = "게시글을 찾을 수 없음",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDto.class)))
    })
    @GetMapping("/admin/{id}")
    public ResponseEntity<PostResponseDto> getPostById(
            @Parameter(description = "게시글 ID", example = "1") @PathVariable Long id) {
        return ResponseEntity.ok(postService.getPostById(id));
    }
}
