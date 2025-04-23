package com.akanksh.service.impl;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.akanksh.dao.PollDao;
import com.akanksh.dao.PollOptionDao;
import com.akanksh.dao.PollVoteDao;
import com.akanksh.dao.UserDao;
import com.akanksh.dto.CastVoteRequestDto;
import com.akanksh.dto.CastVoteResponseDto;
import com.akanksh.entity.Poll;
import com.akanksh.entity.PollOption;
import com.akanksh.entity.PollVote;
import com.akanksh.entity.User;
import com.akanksh.exception.ResourceNotFoundException;
import com.akanksh.service.VoteService;

import jakarta.transaction.Transactional;

@Service
public class VoteServiceImpl implements VoteService{
	
	@Autowired
	private PollDao pollDao;
	
	@Autowired
	private UserDao userDao;
	
	@Autowired
	private PollOptionDao pollOptionDao;
	
	@Autowired
	private PollVoteDao pollVoteDao;

	@Override
	public ResponseEntity<CastVoteResponseDto> castVote(CastVoteRequestDto requestDto) {
	    Logger logger = LoggerFactory.getLogger(this.getClass());
	    String voterEmail = requestDto.getVoterEmail();
	    
	    try {
	        logger.info("Received request to cast vote from user: {} with data: {}", voterEmail, requestDto);
	        
	        Poll poll = pollDao.findById(requestDto.getPollId())
	                .orElseThrow(() -> {
	                    logger.warn("Poll not found with ID: {}", requestDto.getPollId());
	                    return new ResourceNotFoundException("Poll not found with ID: " + requestDto.getPollId());
	                });

	        logger.info("Poll found with ID: {}. Expiry Date: {}", poll.getId(), poll.getExpiryDate());

	        if (poll.getExpiryDate().isBefore(LocalDateTime.now())) {
	            logger.warn("Poll with ID: {} has expired.", poll.getId());
	            return new ResponseEntity<>(new CastVoteResponseDto(null, "Poll has expired."), HttpStatus.BAD_REQUEST);
	        }

	        if (!poll.isActive()) {
	            logger.warn("Poll with ID: {} is not active.", poll.getId());
	            return new ResponseEntity<>(new CastVoteResponseDto(null, "Poll is not active."), HttpStatus.BAD_REQUEST);
	        }

	        User voter = userDao.getUserbyEmail(voterEmail)
	                .orElseThrow(() -> {
	                    logger.warn("User not found with email: {}", voterEmail);
	                    return new ResourceNotFoundException("User not found with email: " + voterEmail);
	                });
	        
	        logger.info("User found: {}. Checking vote conditions...", voter.getEmail());

	        if (!poll.isAllowMultipleSelect() && requestDto.getOptionIds().size() > 1) {
	            logger.warn("User {} attempted multiple selection in a single-select poll with ID: {}", voter.getEmail(), poll.getId());
	            return new ResponseEntity<>(new CastVoteResponseDto(null, "Multiple selection not allowed for this poll."), HttpStatus.BAD_REQUEST);
	        }

	        List<PollOption> selectedOptions = pollOptionDao.findAllById(requestDto.getOptionIds());
	        if (selectedOptions.size() != requestDto.getOptionIds().size()) {
	            logger.warn("Some option IDs are invalid for poll ID: {}", poll.getId());
	            return new ResponseEntity<>(new CastVoteResponseDto(null, "Some option IDs are invalid for this poll."), HttpStatus.BAD_REQUEST);
	        }
	        
	        // Check if options belong to the given poll
	        boolean invalidOptionExists = selectedOptions.stream()
	                .anyMatch(option -> !option.getPoll().getId().equals(poll.getId()));

	        if (invalidOptionExists) {
	            logger.warn("Option id and poll id mismatch for poll ID: {}", poll.getId());
	            return new ResponseEntity<>(new CastVoteResponseDto(null, "Option id and poll id mismatch."), HttpStatus.BAD_REQUEST);
	        }

	        boolean hasVoted = pollVoteDao.existsByPollAndVoter(poll, voter);
	        if (hasVoted) {
	            logger.warn("User {} has already voted in poll with ID: {}", voter.getEmail(), poll.getId());
	            return new ResponseEntity<>(new CastVoteResponseDto(null, "User has already voted in this poll."), HttpStatus.BAD_REQUEST);
	        }

	        // Proceed with casting the vote
	        List<Long> voteIds = new ArrayList<>();
	        for (PollOption option : selectedOptions) {
	            PollVote vote = new PollVote();
	            vote.setPoll(poll);
	            vote.setSelectedOption(option);
	            vote.setVoter(voter);

	            PollVote savedVote = pollVoteDao.saveVote(vote);
	            voteIds.add(savedVote.getId());
	            logger.info("Vote cast for option ID: {} in poll ID: {} by user: {}", option.getId(), poll.getId(), voter.getEmail());
	        }

	        logger.info("Votes successfully cast for poll ID: {}", poll.getId());
	        return new ResponseEntity<>(new CastVoteResponseDto(voteIds, "Vote cast successfully!"), HttpStatus.OK);
	        
	    } catch (ResourceNotFoundException ex) {
	        logger.warn("Error occurred: {}", ex.getMessage());
	        return new ResponseEntity<>(new CastVoteResponseDto(null, ex.getMessage()), HttpStatus.NOT_FOUND);
	    } catch (Exception ex) {
	        logger.error("An unexpected error occurred while casting vote for user {}: {}", voterEmail, ex.getMessage(), ex);
	        return new ResponseEntity<>(new CastVoteResponseDto(null, "An unexpected error occurred: " + ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	}

	@Transactional
	@Override
	public void changeVote(CastVoteRequestDto requestDto) {
	    Logger logger = LoggerFactory.getLogger(this.getClass());
	    
	    String voterEmail = requestDto.getVoterEmail();
	    Long pollId = requestDto.getPollId();
	    
	    try {
	        logger.info("Received request to change vote for user: {} on poll ID: {}", voterEmail, pollId);

	        // Check if user exists
	        User user = userDao.getUserbyEmail(voterEmail)
	                .orElseThrow(() -> {
	                    logger.warn("User not found with email: {}", voterEmail);
	                    return new ResourceNotFoundException("User not found with email: " + voterEmail);
	                });

	        logger.info("User found: {}", user.getEmail());

	        // Fetch poll by ID
	        Poll poll = pollDao.findById(pollId)
	                .orElseThrow(() -> {
	                    logger.warn("Poll not found with ID: {}", pollId);
	                    return new ResourceNotFoundException("Poll not found with ID: " + pollId);
	                });

	        logger.info("Poll found: {} with question: {}", poll.getId(), poll.getQuestion());

	        // Check if the poll is active
	        if (!poll.isActive()) {
	            logger.error("Poll ID: {} is not active. Cannot change vote.", pollId);
	            throw new IllegalStateException("Cannot change vote. Poll is not active.");
	        }

	        // Check if the user has already voted in the poll
	        List<PollVote> existingVotes = pollVoteDao.findByPollAndVoter(poll, user);
	        if (existingVotes.isEmpty()) {
	            logger.error("User: {} has not voted in Poll ID: {}", user.getEmail(), pollId);
	            throw new IllegalStateException("User has not voted in this poll.");
	        }

	        logger.info("User has existing votes in Poll ID: {}. Proceeding to validate new votes.", pollId);

	        // Validate that all option IDs exist and belong to the poll
	        List<PollOption> selectedOptions = requestDto.getOptionIds().stream()
	                .map(optionId -> pollOptionDao.findById(optionId)
	                        .orElseThrow(() -> new ResourceNotFoundException("Option not found with ID: " + optionId)))
	                .toList();

	        // Ensure all selected options belong to the same poll
	        if (selectedOptions.stream().anyMatch(option -> !option.getPoll().getId().equals(poll.getId()))) {
	            logger.error("One or more selected options do not belong to Poll ID: {}", pollId);
	            throw new IllegalArgumentException("One or more options do not belong to the given poll.");
	        }
	        
	        if (!poll.isAllowMultipleSelect() && selectedOptions.size() > 1) {
	            logger.error("Poll ID: {} does not allow multiple selections, but multiple options were selected.", pollId);
	            throw new IllegalArgumentException("This poll does not allow multiple selections.");
	        }

	        // Compare existing votes with new selection
	        List<Long> existingOptionIds = existingVotes.stream()
	                .map(vote -> vote.getSelectedOption().getId())
	                .sorted()
	                .toList();

	        List<Long> selectedOptionIds = selectedOptions.stream()
	                .map(PollOption::getId)
	                .sorted()
	                .toList();

	        if (existingOptionIds.equals(selectedOptionIds)) {
	            logger.info("User has selected the same options. No changes detected.");
	            throw new IllegalStateException("Cannot change vote to the same vote. No changes detected.");
	        }

	        // Delete existing votes for the user and poll
	        logger.info("Deleting existing votes for user: {} on Poll ID: {}", user.getEmail(), pollId);
	        pollVoteDao.deleteVotesByPollAndVoter(poll, user);

	        // Register new votes
	        logger.info("Registering new votes for user: {} on Poll ID: {}", user.getEmail(), pollId);
	        for (PollOption selectedOption : selectedOptions) {
	            PollVote newVote = new PollVote();
	            newVote.setPoll(poll);
	            newVote.setVoter(user);
	            newVote.setSelectedOption(selectedOption);
	            pollVoteDao.saveVote(newVote);
	            logger.info("New vote registered for user: {} on option ID: {}", user.getEmail(), selectedOption.getId());
	        }

	        logger.info("Vote change successfully completed for user: {} on Poll ID: {}", user.getEmail(), pollId);

	    } catch (ResourceNotFoundException ex) {
	        logger.warn("Error occurred while changing vote: {}", ex.getMessage());
	        throw ex;
	    } catch (IllegalStateException | IllegalArgumentException ex) {
	        logger.error("Invalid state or argument while changing vote: {}", ex.getMessage());
	        throw ex;
	    } catch (Exception ex) {
	        logger.error("An unexpected error occurred while changing vote for user: {}: {}", voterEmail, ex.getMessage(), ex);
	        throw new RuntimeException("An unexpected error occurred: " + ex.getMessage(), ex);
	    }
	}

	@Transactional
	@Override
	public void deleteVote(Long pollId, String voterEmail) {
	    Logger logger = LoggerFactory.getLogger(this.getClass());

	    logger.info("Received request to delete vote for Poll ID: {} by user: {}", pollId, voterEmail);

	    try {
	        User user = userDao.getUserbyEmail(voterEmail)
	                .orElseThrow(() -> {
	                    logger.warn("User not found with email: {}", voterEmail);
	                    return new ResourceNotFoundException("User not found with email: " + voterEmail);
	                });

	        logger.info("User found: {} with email: {}", user.getFirstName(), voterEmail);

	        Poll poll = pollDao.findById(pollId)
	                .orElseThrow(() -> {
	                    logger.warn("Poll not found with ID: {}", pollId);
	                    return new ResourceNotFoundException("Poll not found with ID: " + pollId);
	                });

	        logger.info("Poll found: {} with question: {}", pollId, poll.getQuestion());

	        // Delete vote
	        pollVoteDao.deleteVotesByPollAndVoter(poll, user);
	        logger.info("Vote deleted for Poll ID: {} by user: {}", pollId, voterEmail);

	    } catch (ResourceNotFoundException ex) {
	        logger.warn("Error occurred while deleting vote for Poll ID: {} by user {}: {}", pollId, voterEmail, ex.getMessage());
	        throw ex;
	    } catch (Exception ex) {
	        logger.error("An unexpected error occurred while deleting vote for Poll ID: {} by user {}: {}", pollId, voterEmail, ex.getMessage(), ex);
	        throw new RuntimeException("An unexpected error occurred: " + ex.getMessage(), ex);
	    }
	}

}
