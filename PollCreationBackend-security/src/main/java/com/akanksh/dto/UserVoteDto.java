package com.akanksh.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserVoteDto {
    private String email;
    private String name;
    private Long votedOptionId;
}

