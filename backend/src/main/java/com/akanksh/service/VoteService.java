package com.akanksh.service;

import org.springframework.http.ResponseEntity;

import com.akanksh.dto.CastVoteRequestDto;
import com.akanksh.dto.CastVoteResponseDto;

public interface VoteService {

	ResponseEntity<CastVoteResponseDto> castVote(CastVoteRequestDto requestDto);

	void changeVote(CastVoteRequestDto requestDto);

	void deleteVote(Long pollId, String voterEmail);

}
