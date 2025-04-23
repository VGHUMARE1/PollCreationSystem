package com.akanksh.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PollStatisticsResponseDto {
	private Long id;
    private boolean allowMultiple;
    private LocalDateTime expiryDateTime;
    private String question;
    private String status;

    private CreatorDto creator;
    private List<OptionStatsDto> options;
    private List<UserVoteDto> voters;

}
