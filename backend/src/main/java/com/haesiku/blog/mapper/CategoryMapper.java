package com.haesiku.blog.mapper;

import com.haesiku.blog.dto.CategoryResponseDto;
import com.haesiku.blog.entity.Category;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CategoryMapper {

    CategoryResponseDto toResponseDto(Category category);
}
