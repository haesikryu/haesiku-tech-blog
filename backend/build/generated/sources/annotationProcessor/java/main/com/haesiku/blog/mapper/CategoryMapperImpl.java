package com.haesiku.blog.mapper;

import com.haesiku.blog.dto.CategoryResponseDto;
import com.haesiku.blog.entity.Category;
import java.time.LocalDateTime;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-03-02T19:02:15+0900",
    comments = "version: 1.5.5.Final, compiler: IncrementalProcessingEnvironment from gradle-language-java-8.14.3.jar, environment: Java 21.0.10 (Eclipse Adoptium)"
)
@Component
public class CategoryMapperImpl implements CategoryMapper {

    @Override
    public CategoryResponseDto toResponseDto(Category category) {
        if ( category == null ) {
            return null;
        }

        Long id = null;
        String name = null;
        String slug = null;
        String description = null;
        LocalDateTime createdAt = null;

        id = category.getId();
        name = category.getName();
        slug = category.getSlug();
        description = category.getDescription();
        createdAt = category.getCreatedAt();

        CategoryResponseDto categoryResponseDto = new CategoryResponseDto( id, name, slug, description, createdAt );

        return categoryResponseDto;
    }
}
