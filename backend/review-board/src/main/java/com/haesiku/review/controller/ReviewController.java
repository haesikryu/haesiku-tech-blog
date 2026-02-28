package com.haesiku.review.controller;

import com.haesiku.review.dto.BookInfoDto;
import com.haesiku.review.dto.ErrorResponseDto;
import com.haesiku.review.dto.PageResponseDto;
import com.haesiku.review.dto.ReviewRequestDto;
import com.haesiku.review.dto.ReviewResponseDto;
import com.haesiku.review.entity.ReviewType;
import com.haesiku.review.service.BookLookupService;
import com.haesiku.review.service.ReviewService;
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

@Tag(name = "Reviews", description = "책/강의 후기 API")
@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;
    private final BookLookupService bookLookupService;

    @Operation(summary = "후기 생성", description = "새 책/강의 후기를 생성합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "후기 생성 성공",
                    content = @Content(schema = @Schema(implementation = ReviewResponseDto.class))),
            @ApiResponse(responseCode = "400", description = "입력값 검증 실패",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDto.class)))
    })
    @io.swagger.v3.oas.annotations.parameters.RequestBody(
            description = "후기 생성 요청",
            required = true,
            content = @Content(examples = @ExampleObject(value = """
                    {
                      "reviewType": "BOOK",
                      "title": "실무에 바로 쓸 수 있는 책",
                      "content": "# 인상 깊었던 점\\n...",
                      "rating": 5,
                      "itemTitle": "클린 코드",
                      "itemAuthor": "로버트 C. 마틴",
                      "itemLink": "https://..."
                    }
                    """)))
    @PostMapping
    public ResponseEntity<ReviewResponseDto> createReview(@Valid @RequestBody ReviewRequestDto request) {
        ReviewResponseDto response = reviewService.createReview(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(summary = "후기 수정", description = "기존 후기를 수정합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "후기 수정 성공"),
            @ApiResponse(responseCode = "400", description = "입력값 검증 실패",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDto.class))),
            @ApiResponse(responseCode = "404", description = "후기를 찾을 수 없음",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDto.class)))
    })
    @PutMapping("/{id}")
    public ResponseEntity<ReviewResponseDto> updateReview(
            @Parameter(description = "후기 ID", example = "1") @PathVariable Long id,
            @Valid @RequestBody ReviewRequestDto request) {
        return ResponseEntity.ok(reviewService.updateReview(id, request));
    }

    @Operation(summary = "후기 삭제", description = "후기를 영구 삭제합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "후기 삭제 성공"),
            @ApiResponse(responseCode = "404", description = "후기를 찾을 수 없음",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDto.class)))
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(
            @Parameter(description = "후기 ID", example = "1") @PathVariable Long id) {
        reviewService.deleteReview(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "후기 상세 조회", description = "ID로 후기를 조회합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "후기 조회 성공"),
            @ApiResponse(responseCode = "404", description = "후기를 찾을 수 없음",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDto.class)))
    })
    @GetMapping("/{id}")
    public ResponseEntity<ReviewResponseDto> getReview(
            @Parameter(description = "후기 ID", example = "1") @PathVariable Long id) {
        return ResponseEntity.ok(reviewService.getReview(id));
    }

    @Operation(summary = "후기 목록 조회", description = "전체 후기를 페이지 단위로 조회합니다.")
    @ApiResponse(responseCode = "200", description = "후기 목록 조회 성공")
    @GetMapping
    public ResponseEntity<PageResponseDto<ReviewResponseDto>> getAllReviews(
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC)
            Pageable pageable) {
        return ResponseEntity.ok(PageResponseDto.from(reviewService.getAllReviews(pageable)));
    }

    @Operation(summary = "유형별 후기 목록", description = "BOOK 또는 COURSE 유형별로 후기를 조회합니다.")
    @ApiResponse(responseCode = "200", description = "후기 목록 조회 성공")
    @GetMapping("/type/{reviewType}")
    public ResponseEntity<PageResponseDto<ReviewResponseDto>> getReviewsByType(
            @Parameter(description = "후기 유형 (BOOK | COURSE)", example = "BOOK") @PathVariable ReviewType reviewType,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC)
            Pageable pageable) {
        return ResponseEntity.ok(PageResponseDto.from(reviewService.getReviewsByType(reviewType, pageable)));
    }

    @Operation(summary = "후기 검색", description = "제목 또는 내용에 키워드가 포함된 후기를 검색합니다.")
    @ApiResponse(responseCode = "200", description = "검색 결과 조회 성공")
    @GetMapping("/search")
    public ResponseEntity<PageResponseDto<ReviewResponseDto>> searchReviews(
            @Parameter(description = "검색 키워드", example = "클린 코드") @RequestParam String keyword,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC)
            Pageable pageable) {
        return ResponseEntity.ok(PageResponseDto.from(reviewService.searchReviews(keyword, pageable)));
    }

    @Operation(summary = "ISBN으로 책 정보 조회", description = "Open Library API를 통해 ISBN으로 책 제목·저자·링크를 조회합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "책 정보 조회 성공",
                    content = @Content(schema = @Schema(implementation = BookInfoDto.class))),
            @ApiResponse(responseCode = "404", description = "해당 ISBN의 책 정보를 찾을 수 없음",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDto.class)))
    })
    @GetMapping("/books/isbn/{isbn}")
    public ResponseEntity<BookInfoDto> getBookByIsbn(
            @Parameter(description = "ISBN-10 또는 ISBN-13", example = "9788966262471") @PathVariable String isbn) {
        BookInfoDto book = bookLookupService.lookupByIsbn(isbn);
        if (book == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(book);
    }
}
