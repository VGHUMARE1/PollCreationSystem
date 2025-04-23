package com.akanksh.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.akanksh.dto.CastVoteRequestDto;
import com.akanksh.dto.CastVoteResponseDto;
import com.akanksh.dto.CreatePollRequestDto;
import com.akanksh.dto.CreatePollResponseDto;
import com.akanksh.dto.PollResponseDto;
import com.akanksh.dto.PollStatisticsResponseDto;
import com.akanksh.dto.PollSummaryDto;
import com.akanksh.dto.UpdatePollRequestDto;
import com.akanksh.dto.VotedPollResponseDto;
import com.akanksh.service.PollService;

@RestController
@RequestMapping("/polls")
@CrossOrigin
public class PollController {

	@Autowired
	private PollService pollService;

	/*CREATE OPERATIONS OF POLL
	 * 1. Create Poll 
	 */
	@PostMapping()
	public ResponseEntity<CreatePollResponseDto> createPoll(@RequestBody CreatePollRequestDto requestDto) {
		return pollService.createPoll(requestDto);
	}

	// Create Operation finished
	
	
	/*READ OPERATIONS OF POLL
	 * 1. Get poll by user : Will return the summary of all the poll created by the user.
	 * 2. Get all active poll 
	 * 3. Get voted polls: Will return all the polls in which user has voted in past.
	 * 4. Get Poll Statistics : Will return the Statistics of the particular poll
	 * 5. 
	 * */
	@GetMapping()
	public ResponseEntity<List<PollSummaryDto>> getPollsByUser(@RequestParam String email) {
		List<PollSummaryDto> pollSummaries = pollService.getPollByUser(email);
		return ResponseEntity.ok(pollSummaries);
	}

	@GetMapping("/active")
	public List<PollResponseDto> getAllActivePolls(@RequestParam  String email) {
		return pollService.getAllActivePolls(email);
	}
	
	@GetMapping("/voted")
	public List<VotedPollResponseDto> getVotedPolls(@RequestParam String email) {
		return pollService.getVotedPolls(email);
	}
	
	@GetMapping("/analysis")
	public ResponseEntity<PollStatisticsResponseDto> getPollStatistics(@RequestParam Long pollId) {
		return ResponseEntity.ok(pollService.getPollStatistics(pollId));
	}
	
	// Read Operations finished

	/* UPDATE OPERATIONS OF POLL
	 * 1. Update Poll : Update the question, options or multiple select setting
	 * 2. Update Expiry of Poll 
	 * 3. Stop Poll :  Stop poll from taking responses from user, also make it invisible to users
	 * 4. Resume Poll
	 * 5. 
	 * */
	
	@PutMapping()
    public ResponseEntity<String> updatePoll(@RequestBody UpdatePollRequestDto requestDto) {
        pollService.updatePoll(requestDto);
        return ResponseEntity.ok("Poll updated successfully.");
    }
	
	@PutMapping("/expiry/{pollId}/{newExpiryDate}")
	public ResponseEntity<String> updatePollExpiry(@PathVariable Long pollId, @PathVariable LocalDateTime newExpiryDate) {
		pollService.updatePollExpiry(pollId, newExpiryDate);
		return ResponseEntity.ok("Expiry date updated successfully for Poll ID: " + pollId);
	}
	
	@PutMapping("stop/{pollId}")
	public ResponseEntity<String> stopPoll(@PathVariable Long pollId) {
		pollService.stopPoll(pollId);
		return ResponseEntity.ok("Poll with ID " + pollId + " has been stopped.");
	}

	@PutMapping("resume/{pollId}")
	public ResponseEntity<String> resumePoll(@PathVariable Long pollId) {
		pollService.resumePoll(pollId);
		return ResponseEntity.ok("Poll with ID " + pollId + " has been resumed.");
	}
	
	//  Update Operations finished
	
	
	// DELETE POLL
	@DeleteMapping()
	public ResponseEntity<?> deletePoll(@RequestParam Long id) {
		return pollService.deletePoll(id);
	}

}