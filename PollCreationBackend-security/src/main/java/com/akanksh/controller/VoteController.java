package com.akanksh.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.akanksh.dto.CastVoteRequestDto;
import com.akanksh.dto.CastVoteResponseDto;
import com.akanksh.service.PollService;
import com.akanksh.service.VoteService;

@RestController
@RequestMapping("/vote")
@CrossOrigin
public class VoteController {

	@Autowired
	private VoteService voteService;
	
		
	@PostMapping()
	public ResponseEntity<CastVoteResponseDto> castVote(@RequestBody CastVoteRequestDto requestDto) {
		return voteService.castVote(requestDto);
	}

	@PutMapping()
	public ResponseEntity<String> changeVote(@RequestBody CastVoteRequestDto requestDto) {
		voteService.changeVote(requestDto);
		return ResponseEntity.ok("Vote changed successfully.");
	}

	@DeleteMapping()
    public ResponseEntity<String> deleteVote(@RequestParam Long pollId, @RequestParam String email) {
		voteService.deleteVote(pollId, email);
        return ResponseEntity.ok("Vote deleted successfully.");
    }

}
