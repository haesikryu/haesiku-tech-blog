package com.haesiku.review.mapper;

import com.haesiku.review.dto.ReviewResponseDto;
import com.haesiku.review.entity.Review;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ReviewMapper {

    ReviewResponseDto toResponseDto(Review review);
}
