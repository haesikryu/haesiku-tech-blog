package com.haesiku.review.repository;

import com.haesiku.review.entity.Review;
import com.haesiku.review.entity.ReviewType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    Page<Review> findAllByOrderByCreatedAtDesc(Pageable pageable);

    Page<Review> findByReviewTypeOrderByCreatedAtDesc(ReviewType reviewType, Pageable pageable);

    Page<Review> findByTitleContainingOrContentContainingOrderByCreatedAtDesc(
            String titleKeyword, String contentKeyword, Pageable pageable);
}
