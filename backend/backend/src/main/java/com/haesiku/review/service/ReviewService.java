package com.haesiku.review.service;

import com.haesiku.review.dto.ReviewRequestDto;
import com.haesiku.review.dto.ReviewResponseDto;
import com.haesiku.review.entity.Review;
import com.haesiku.review.entity.ReviewType;
import com.haesiku.common.exception.EntityNotFoundException;
import com.haesiku.review.mapper.ReviewMapper;
import com.haesiku.review.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ReviewMapper reviewMapper;

    @Transactional
    public ReviewResponseDto createReview(ReviewRequestDto request) {
        Review review = Review.builder()
                .reviewType(request.reviewType())
                .title(request.title())
                .content(request.content())
                .rating(request.rating())
                .itemTitle(request.itemTitle())
                .itemAuthor(request.itemAuthor())
                .itemLink(request.itemLink())
                .build();
        return reviewMapper.toResponseDto(reviewRepository.save(review));
    }

    @Transactional
    public ReviewResponseDto updateReview(Long id, ReviewRequestDto request) {
        Review review = findReviewById(id);
        review.update(
                request.title(),
                request.content(),
                request.rating(),
                request.itemTitle(),
                request.itemAuthor(),
                request.itemLink()
        );
        return reviewMapper.toResponseDto(review);
    }

    @Transactional
    public void deleteReview(Long id) {
        Review review = findReviewById(id);
        reviewRepository.delete(review);
    }

    public ReviewResponseDto getReview(Long id) {
        Review review = findReviewById(id);
        return reviewMapper.toResponseDto(review);
    }

    public Page<ReviewResponseDto> getAllReviews(Pageable pageable) {
        return reviewRepository.findAllByOrderByCreatedAtDesc(pageable)
                .map(reviewMapper::toResponseDto);
    }

    public Page<ReviewResponseDto> getReviewsByType(ReviewType reviewType, Pageable pageable) {
        return reviewRepository.findByReviewTypeOrderByCreatedAtDesc(reviewType, pageable)
                .map(reviewMapper::toResponseDto);
    }

    public Page<ReviewResponseDto> searchReviews(String keyword, Pageable pageable) {
        return reviewRepository.findByTitleContainingOrContentContainingOrderByCreatedAtDesc(
                        keyword, keyword, pageable)
                .map(reviewMapper::toResponseDto);
    }

    private Review findReviewById(Long id) {
        return reviewRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Review", "id", id));
    }
}
