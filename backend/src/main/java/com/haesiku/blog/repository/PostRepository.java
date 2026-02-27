package com.haesiku.blog.repository;

import com.haesiku.blog.entity.Post;
import com.haesiku.blog.entity.PostStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface PostRepository extends JpaRepository<Post, Long> {

    Optional<Post> findBySlug(String slug);

    Page<Post> findByStatusOrderByCreatedAtDesc(PostStatus status, Pageable pageable);

    Page<Post> findByTitleContainingOrderByCreatedAtDesc(String keyword, Pageable pageable);

    Page<Post> findByCategoryIdOrderByCreatedAtDesc(Long categoryId, Pageable pageable);

    @Query("SELECT DISTINCT p FROM Post p JOIN p.tags t " +
            "WHERE t.id = :tagId " +
            "ORDER BY p.createdAt DESC")
    Page<Post> findByTagId(@Param("tagId") Long tagId, Pageable pageable);

    @Query("SELECT DISTINCT p FROM Post p JOIN p.tags t " +
            "WHERE t.name IN :tagNames " +
            "ORDER BY p.createdAt DESC")
    Page<Post> findByTagNames(@Param("tagNames") java.util.List<String> tagNames, Pageable pageable);

    @Query("SELECT DISTINCT p FROM Post p JOIN p.tags t " +
            "WHERE p.status = :status AND t.id = :tagId " +
            "ORDER BY p.createdAt DESC")
    Page<Post> findByStatusAndTagId(@Param("status") PostStatus status,
                                    @Param("tagId") Long tagId,
                                    Pageable pageable);
}
