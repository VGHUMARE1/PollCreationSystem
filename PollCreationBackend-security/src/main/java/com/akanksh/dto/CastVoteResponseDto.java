package com.akanksh.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CastVoteResponseDto {

    private List<Long> voteIds; // Return multiple vote IDs if applicable
    private String message;
}
