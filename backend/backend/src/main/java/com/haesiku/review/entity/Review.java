package com.haesiku.review.entity;

import com.haesiku.common.entity.BaseEntity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "reviews", indexes = {
        @Index(name = "idx_review_type", columnList = "reviewType"),
        @Index(name = "idx_review_created_at", columnList = "createdAt")
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Review extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReviewType reviewType;

    @NotBlank
    @Size(max = 200)
    @Column(nullable = false, length = 200)
    private String title;

    @NotBlank
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false)
    private Integer rating;

    @NotBlank
    @Size(max = 300)
    @Column(nullable = false, length = 300)
    private String itemTitle;

    @Size(max = 200)
    @Column(length = 200)
    private String itemAuthor;

    @Size(max = 500)
    @Column(length = 500)
    private String itemLink;

    @Builder
    public Review(ReviewType reviewType, String title, String content, Integer rating,
                  String itemTitle, String itemAuthor, String itemLink) {
        this.reviewType = reviewType;
        this.title = title;
        this.content = content;
        this.rating = rating;
        this.itemTitle = itemTitle;
        this.itemAuthor = itemAuthor;
        this.itemLink = itemLink;
    }

    public void update(String title, String content, Integer rating,
                       String itemTitle, String itemAuthor, String itemLink) {
        this.title = title;
        this.content = content;
        this.rating = rating;
        this.itemTitle = itemTitle;
        this.itemAuthor = itemAuthor;
        this.itemLink = itemLink;
    }
}
