// PollService.java
package com.akanksh.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.ResponseEntity;

import com.akanksh.dto.CastVoteRequestDto;
import com.akanksh.dto.CastVoteResponseDto;
import com.akanksh.dto.CreatePollRequestDto;
import com.akanksh.dto.CreatePollResponseDto;
import com.akanksh.dto.PollResponseDto;
import com.akanksh.dto.PollStatisticsResponseDto;
import com.akanksh.dto.PollSummaryDto;
import com.akanksh.dto.UpdatePollRequestDto;
import com.akanksh.dto.VotedPollResponseDto;

public interface PollService {
	ResponseEntity<CreatePollResponseDto> createPoll(CreatePollRequestDto requestDto);

	List<PollSummaryDto> getPollByUser(String email);

	ResponseEntity<?> deletePoll(Long id);

	PollStatisticsResponseDto getPollStatistics(Long pollId);

	List<PollResponseDto> getAllActivePolls(String email);

	List<VotedPollResponseDto> getVotedPolls(String email);

	void stopPoll(Long pollId);

	void resumePoll(Long pollId);

	void updatePollExpiry(Long pollId, LocalDateTime newExpiryDate);

	void updatePoll(UpdatePollRequestDto updateRequest);

}