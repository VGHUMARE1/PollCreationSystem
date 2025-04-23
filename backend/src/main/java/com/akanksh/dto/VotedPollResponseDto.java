package com.akanksh.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VotedPollResponseDto {
	private Long _id;
	private String question;
    private List<OptionDto> options;
    private List<OptionDto> userVotes;
	private Long totalVotes;
	private String createdBy;
	private LocalDateTime expiryDate;
//	private LocalDateTime votedDate;
}
