package com.akanksh.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PollSummaryDto {
    private Long id;
    private String question;
    private LocalDateTime expiryDate;
    private int totalVotes;
    private String status;
    private String createdBy;
    private String creatorName;
    private List<OptionStatsDto> options;
}
