package com.haesiku.blog.entity;

import com.haesiku.blog.util.SlugUtils;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "tags")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Tag extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false, unique = true)
    private String slug;

    @Builder
    public Tag(String name, String slug) {
        this.name = name;
        this.slug = slug;
    }

    @PrePersist
    public void prePersist() {
        if (this.slug == null || this.slug.isBlank()) {
            this.slug = SlugUtils.toSlug(this.name);
        }
    }

    public void update(String name) {
        this.name = name;
        this.slug = SlugUtils.toSlug(name);
    }
}
