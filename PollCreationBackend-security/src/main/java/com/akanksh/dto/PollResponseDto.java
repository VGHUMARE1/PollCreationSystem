package com.akanksh.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PollResponseDto {
    private Long _id;
    private String question;
    private String createdBy;
    private LocalDateTime expiryDate;
    private Long totalVotes;
    private boolean allowMultiple;
    private List<OptionDto> options;
    private boolean userVoted; // Flag indicating if the user has already voted
    private List<OptionDto> selectedOptions; // Options the user has selected
}