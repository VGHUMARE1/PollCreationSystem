package com.akanksh.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CreatePollResponseDto {
    private Long pollId;
    private String message;
}
