package com.haesiku.blog.mapper;

import com.haesiku.blog.dto.TagResponseDto;
import com.haesiku.blog.entity.Tag;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TagMapper {

    TagResponseDto toResponseDto(Tag tag);
}
