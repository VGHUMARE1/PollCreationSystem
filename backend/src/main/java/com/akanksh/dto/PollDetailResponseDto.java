package com.akanksh.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PollDetailResponseDto {
    private Long pollId;
    private String question;
    private List<UserVoteDto> userVotes;
}