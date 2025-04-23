package com.akanksh.service.impl;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
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
import com.akanksh.dto.CreatePollRequestDto;
import com.akanksh.dto.CreatePollResponseDto;
import com.akanksh.dto.CreatorDto;
import com.akanksh.dto.OptionDto;
import com.akanksh.dto.OptionStatsDto;
import com.akanksh.dto.PollResponseDto;
import com.akanksh.dto.PollStatisticsResponseDto;
import com.akanksh.dto.PollSummaryDto;
import com.akanksh.dto.UpdatePollRequestDto;
import com.akanksh.dto.UserVoteDto;
import com.akanksh.dto.VotedPollResponseDto;
import com.akanksh.entity.Poll;
import com.akanksh.entity.PollOption;
import com.akanksh.entity.PollVote;
import com.akanksh.entity.User;
import com.akanksh.exception.ResourceNotFoundException;
import com.akanksh.service.PollService;

import org.slf4j.Logger;
import jakarta.transaction.Transactional;

@Service
public class PollServiceImpl implements PollService {

	@Autowired
	private PollDao pollDao;

	@Autowired
	private PollOptionDao pollOptionDao;
	
	@Autowired
    private PollVoteDao pollVoteDao;	

	@Autowired
	private UserDao userDao;

	@Autowired
	private ModelMapper modelMapper;
	
	@Autowired
	private EmailService emailService;
	
	private static final Logger logger = LoggerFactory.getLogger(PollServiceImpl.class);

	
	// CREATE POLL OPERATION
	
	@Transactional
	@Override
	public ResponseEntity<CreatePollResponseDto> createPoll(CreatePollRequestDto requestDto) {
	    Logger logger = LoggerFactory.getLogger(this.getClass());
	    String userEmail = requestDto.getEmail();
	    
	    System.out.println("Inside createPoll service code : " + requestDto);
	    
	    try {
	        logger.info("Received request to create poll from user: {} with data: {}", userEmail, requestDto);
	        
	        User user = userDao.getUserbyEmail(userEmail).orElseThrow(() -> {
	            logger.warn("User not found with email: {}", userEmail);
	            return new ResourceNotFoundException("User not found with email: " + userEmail);
	        });
	        
	        logger.info("User found: {}", user.getEmail());
	        
	        Poll poll = new Poll();
	        poll.setQuestion(requestDto.getQuestion());
	        poll.setAllowMultipleSelect(requestDto.isAllowMultiple());
	        poll.setExpiryDate(requestDto.getExpiryDateTime());
	        poll.setCreatedAt(requestDto.getCreatedAt());
	        poll.setActive(true);
	        poll.setCreatedBy(user);
	        
	        Poll savedPoll = pollDao.createPoll(poll);
	        logger.info("Poll created successfully with ID: {} by user: {}", savedPoll.getId(), userEmail);
	        
	        List<PollOption> pollOptions = requestDto.getOptions().stream().map(option -> {
	            PollOption pollOption = new PollOption();
	            pollOption.setOptionText(option);
	            pollOption.setPoll(savedPoll);
	            return pollOption;
	        }).collect(Collectors.toList());
	        
	        pollOptionDao.saveAll(pollOptions);
	        logger.info("Poll options saved successfully for poll ID: {}", savedPoll.getId());
	        
	        CreatePollResponseDto responseDto = new CreatePollResponseDto(savedPoll.getId(), "Poll created successfully!");
	        return new ResponseEntity<>(responseDto, HttpStatus.CREATED);
	        
	    } catch (ResourceNotFoundException ex) {
	        logger.warn("Poll creation failed: {}", ex.getMessage());
	        return new ResponseEntity<>(new CreatePollResponseDto(null, ex.getMessage()), HttpStatus.NOT_FOUND);}
//	    } catch (Exception ex) {
//	        logger.error("An unexpected error occurred while creating poll for user {}: {}", userEmail, ex.getMessage(), ex);
//	        return new ResponseEntity<CreatePollResponseDto>(new CreatePollResponseDto(null, "An unexpected error occurred: " + ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
//	    }
	}

	
	/*READ OPERATIONS OF POLL
	 * 1. Get poll by user : Will return the summary of all the poll created by the user.
	 * 2. Get all active poll 
	 * 3. Get voted polls: Will return all the polls in which user has voted in past.
	 * 4. Get Poll Statistics : Will return the Statistics of the particular poll
	 * 5. 
	 */
	@Override
	public List<PollSummaryDto> getPollByUser(String email) {
	    Logger logger = LoggerFactory.getLogger(getClass());

	    // Log message indicating the user is requesting the service
	    logger.info("User with email '{}' is requesting poll information.", email);

	    // Check if user exists
	    User user = userDao.getUserbyEmail(email)
	            .orElseThrow(() -> {
	                logger.error("User not found with email: {}", email);
	                return new ResourceNotFoundException("User not found with email: " + email);
	            });

	    logger.info("User found with email: {}", user.getEmail());

	    // Fetch polls by user
	    List<Poll> polls = pollDao.findPollsByCreatedByEmail(email);
	    logger.info("Found {} polls created by user with email: {}", polls.size(), email);

	    // Sort polls by createdAt in descending order
	    polls.sort(Comparator.comparing(Poll::getCreatedAt).reversed());
	    logger.debug("Polls sorted by created date in descending order.");

	    return polls.stream().map(poll -> {
	        int totalVotes = poll.getVotes() != null ? poll.getVotes().size() : 0;
	        String status = poll.isActive() ? "active" : "inactive";

	        logger.debug("Processing poll with ID: {}, Question: '{}', Total Votes: {}, Status: {}",
	                poll.getId(), poll.getQuestion(), totalVotes, status);

	        // Map options with vote counts
	        List<OptionStatsDto> options = poll.getOptions().stream().map(option -> {
	            int optionVotes = option.getVotes() != null ? option.getVotes().size() : 0;
	            logger.debug("Option with ID: {}, Text: '{}', Votes: {}", option.getId(), option.getOptionText(), optionVotes);
	            return new OptionStatsDto(option.getId(), poll.getId(), option.getOptionText(), optionVotes);
	        }).collect(Collectors.toList());

	        // Returning PollSummaryDto with all mapped details
	        logger.info("Returning PollSummaryDto for Poll ID: {}", poll.getId());
	        return new PollSummaryDto(
	                poll.getId(),
	                poll.getQuestion(),
	                poll.getExpiryDate(),
	                totalVotes,
	                status,
	                poll.getCreatedBy().getEmail(),
	                poll.getCreatedBy().getFirstName() + " " + poll.getCreatedBy().getLastName(),
	                options
	        );
	    }).collect(Collectors.toList());
	}
	
	@Override
	public List<PollResponseDto> getAllActivePolls(String email) {
	    Logger logger = LoggerFactory.getLogger(this.getClass());
	    
	    logger.info("Received request to get all active polls for user: {}", email);

	    try {
	        List<Poll> activePolls = pollDao.findByIsActiveTrue();

	        // Sort polls by createdAt in descending order
	        activePolls.sort(Comparator.comparing(Poll::getCreatedAt).reversed());

	        logger.info("Fetched {} active polls", activePolls.size());

	        User user = userDao.getUserbyEmail(email)
	                .orElseThrow(() -> {
	                    logger.warn("User not found with email: {}", email);
	                    return new ResourceNotFoundException("User not found with email: " + email);
	                });

	        logger.info("User found: {} with email: {}", user.getFirstName(), email);

	        return activePolls.stream().map(poll -> {
	            Long totalVotes = poll.getVotes() != null ? (long) poll.getVotes().size() : 0;
	            logger.info("Poll ID: {} has {} total votes", poll.getId(), totalVotes);

	            List<OptionDto> optionDtos = poll.getOptions().stream()
	                    .map(option -> new OptionDto(option.getId(), option.getOptionText()))
	                    .collect(Collectors.toList());

	            PollResponseDto responseDto = new PollResponseDto();
	            responseDto.set_id(poll.getId());
	            responseDto.setQuestion(poll.getQuestion());
	            responseDto.setCreatedBy(poll.getCreatedBy().getEmail());
	            responseDto.setExpiryDate(poll.getExpiryDate());
	            responseDto.setTotalVotes(totalVotes);
	            responseDto.setAllowMultiple(poll.isAllowMultipleSelect());
	            responseDto.setOptions(optionDtos);

	            // Get votes of the user for the specific poll
	            List<PollVote> votes = pollVoteDao.findByPollAndVoter(poll, user);

	            boolean hasVoted = !votes.isEmpty();
	            responseDto.setUserVoted(hasVoted);

	            if (hasVoted) {
	                List<OptionDto> selectedOptions = votes.stream()
	                        .map(vote -> new OptionDto(vote.getSelectedOption().getId(), vote.getSelectedOption().getOptionText()))
	                        .collect(Collectors.toList());

	                responseDto.setSelectedOptions(selectedOptions);
	            }

	            return responseDto;
	        }).collect(Collectors.toList());
	    } catch (ResourceNotFoundException ex) {
	        logger.warn("Error occurred while fetching active polls for user {}: {}", email, ex.getMessage());
	        throw ex;
	    } catch (Exception ex) {
	        logger.error("An unexpected error occurred while fetching active polls for user {}: {}", email, ex.getMessage(), ex);
	        throw new RuntimeException("An unexpected error occurred: " + ex.getMessage(), ex);
	    }
	}
	
	@Override
	public List<VotedPollResponseDto> getVotedPolls(String email) {
	    Logger logger = LoggerFactory.getLogger(this.getClass());

	    try {
	        logger.info("Received request to get voted polls for user: {}", email);

	        // Check if user exists
	        User user = userDao.getUserbyEmail(email)
	                .orElseThrow(() -> {
	                    logger.warn("User not found with email: {}", email);
	                    return new ResourceNotFoundException("User not found with email: " + email);
	                });

	        logger.info("User found with email: {}", user.getEmail());

	        // Fetch all votes by user
	        List<PollVote> votes = pollVoteDao.findByVoter(user);
	        logger.info("Found {} votes for user: {}", votes.size(), user.getEmail());

	        // Group votes by poll to ensure a single response per poll
	        Map<Poll, List<PollVote>> pollVotesMap = votes.stream()
	                .collect(Collectors.groupingBy(PollVote::getPoll));

	        // Sort polls by createdAt in descending order
	        List<VotedPollResponseDto> response = pollVotesMap.entrySet().stream()
	                .sorted(Comparator.comparing(entry -> entry.getKey().getCreatedAt(), Comparator.reverseOrder()))
	                .map(entry -> {
	                    Poll poll = entry.getKey();
	                    List<PollVote> userVotes = entry.getValue();

	                    logger.info("Processing poll ID: {} with question: {}", poll.getId(), poll.getQuestion());

	                    // Convert options to OptionDto
	                    List<OptionDto> options = poll.getOptions().stream()
	                            .map(opt -> new OptionDto(opt.getId(), opt.getOptionText()))
	                            .collect(Collectors.toList());

	                    // Get user's voted options with both ID and Text
	                    List<OptionDto> votedOptions = userVotes.stream()
	                            .map(v -> new OptionDto(v.getSelectedOption().getId(), v.getSelectedOption().getOptionText()))
	                            .collect(Collectors.toList());

	                    logger.info("User voted on {} options for poll ID: {}", votedOptions.size(), poll.getId());

	                    return new VotedPollResponseDto(
	                            poll.getId(),
	                            poll.getQuestion(),
	                            options,
	                            votedOptions,
	                            (long) poll.getVotes().size(),
	                            poll.getCreatedBy().getEmail(),
	                            poll.getExpiryDate()
	                    );
	                }).collect(Collectors.toList());

	        logger.info("Returning {} voted polls for user: {}", response.size(), user.getEmail());

	        return response;

	    } catch (ResourceNotFoundException ex) {
	        logger.warn("Error occurred while fetching voted polls for user {}: {}", email, ex.getMessage());
	        throw ex;
	    } catch (Exception ex) {
	        logger.error("An unexpected error occurred while fetching voted polls for user {}: {}", email, ex.getMessage(), ex);
	        throw new RuntimeException("An unexpected error occurred: " + ex.getMessage(), ex);
	    }
	}

	@Override
	public PollStatisticsResponseDto getPollStatistics(Long pollId) {
	    Logger logger = LoggerFactory.getLogger(this.getClass());
	    
	    logger.info("Received request to get statistics for Poll with ID: {}", pollId);

	    try {
	        // Fetch poll and handle exception if not found
	        Poll poll = pollDao.findById(pollId).orElseThrow(() -> {
	            logger.warn("Poll not found with ID: {}", pollId);
	            return new ResourceNotFoundException("Poll not found with ID: " + pollId);
	        });

	        logger.info("Poll found: {} with question: {}", pollId, poll.getQuestion());

	        // Calculate total votes
	        long totalVotes = poll.getVotes().size();
	        logger.info("Total votes for Poll ID: {}: {}", pollId, totalVotes);

	        // Map options to OptionStatsDto
	        List<OptionStatsDto> optionStats = poll.getOptions().stream().map(option -> {
	            int voteCount = option.getVotes().size();
	            logger.info("Option ID: {} has {} votes", option.getId(), voteCount);
	            return new OptionStatsDto(option.getId(), poll.getId(), option.getOptionText(), voteCount);
	        }).collect(Collectors.toList());

	        // Map votes to UserVoteDto
	        List<UserVoteDto> voterDetails = poll.getVotes().stream().map(vote -> {
	            return new UserVoteDto(
	                    vote.getVoter().getEmail(),
	                    vote.getVoter().getFirstName() + " " + vote.getVoter().getLastName(),
	                    vote.getSelectedOption().getId()
	            );
	        }).collect(Collectors.toList());

	        // Determine poll status
	        String status = poll.isActive() && (poll.getExpiryDate().isAfter(LocalDateTime.now())) ? "active" : "inactive";
	        logger.info("Poll ID: {} is currently {}", pollId, status);

	        // Create creator details
	        CreatorDto creator = new CreatorDto(
	                poll.getCreatedBy().getFirstName() + " " + poll.getCreatedBy().getLastName(),
	                poll.getCreatedBy().getEmail()
	        );

	        // Build and return PollStatisticsResponseDto
	        PollStatisticsResponseDto responseDto = new PollStatisticsResponseDto(
	                poll.getId(),
	                poll.isAllowMultipleSelect(),
	                poll.getExpiryDate(),
	                poll.getQuestion(),
	                status,
	                creator,
	                optionStats,
	                voterDetails
	        );

	        logger.info("Successfully fetched poll statistics for Poll ID: {}", pollId);
	        return responseDto;
	    } catch (ResourceNotFoundException ex) {
	        logger.warn("Error occurred while fetching statistics for Poll ID: {}: {}", pollId, ex.getMessage());
	        throw ex;
	    } catch (Exception ex) {
	        logger.error("An unexpected error occurred while fetching statistics for Poll ID: {}: {}", pollId, ex.getMessage(), ex);
	        throw new RuntimeException("An unexpected error occurred: " + ex.getMessage(), ex);
	    }
	}

	//READ OPERATIONS FINISHED
	
	
	
	/* UPDATE OPERATIONS OF POLL
	 * 1. Update Poll : Update the question, options or multiple select setting
	 * 2. Update Expiry of Poll 
	 * 3. Stop Poll :  Stop poll from taking responses from user, also make it invisible to users
	 * 4. Resume Poll
	 * 5. 
	 * */
	
	@Transactional
	@Override
	public void updatePoll(UpdatePollRequestDto updateRequest) {
	    Logger logger = LoggerFactory.getLogger(this.getClass());

	    logger.info("Received request to update Poll with ID: {}", updateRequest.getPollId());

	    try {
	        Poll poll = pollDao.findById(updateRequest.getPollId())
	                .orElseThrow(() -> {
	                    logger.warn("Poll not found with ID: {}", updateRequest.getPollId());
	                    return new ResourceNotFoundException("Poll not found with ID: " + updateRequest.getPollId());
	                });

	        logger.info("Poll found: {} with question: {}", poll.getId(), poll.getQuestion());

	        boolean deleteVotes = false;
	        String oldQuestion = poll.getQuestion(); // Store the old question to send it as email to user

	        // Update question only if not null & changed
	        if (updateRequest.getQuestion() != null && !poll.getQuestion().equals(updateRequest.getQuestion())) {
	            logger.info("Updating Poll question from '{}' to '{}'", poll.getQuestion(), updateRequest.getQuestion());
	            poll.setQuestion(updateRequest.getQuestion());
	            deleteVotes = true;
	        }

	        // Update allowMultipleSelect only if not null & changed
	        if (updateRequest.getAllowMultipleSelect() != null && poll.isAllowMultipleSelect() != updateRequest.getAllowMultipleSelect()) {
	            logger.info("Updating allowMultipleSelect from '{}' to '{}'", poll.isAllowMultipleSelect(), updateRequest.getAllowMultipleSelect());
	            poll.setAllowMultipleSelect(updateRequest.getAllowMultipleSelect());
	            deleteVotes = true;
	        }

	        // Handle options update
	        if (updateRequest.getOptions() != null) {
	            Set<String> existingOptions = poll.getOptions().stream()
	                    .map(PollOption::getOptionText)
	                    .collect(Collectors.toSet());

	            Set<String> newOptions = updateRequest.getOptions().stream()
	                    .map(OptionDto::getOptionText)
	                    .collect(Collectors.toSet());

	            if (!existingOptions.equals(newOptions)) {
	                logger.info("Options have changed. Deleting old votes.");
	                deleteVotes = true;
	                List<PollOption> updatedOptions = updateRequest.getOptions().stream()
	                        .map(optionDto -> new PollOption(null, optionDto.getOptionText(), poll, null))
	                        .collect(Collectors.toList());

	                poll.getOptions().clear();
	                poll.getOptions().addAll(updatedOptions);
	            }
	        }

	        // If votes should be deleted, do so & send email notifications asynchronously
	        if (deleteVotes) {
	            List<PollVote> votesToDelete = pollVoteDao.findByPoll(poll);
	            pollVoteDao.deleteVotesByPollId(poll.getId());

	            for (PollVote vote : votesToDelete) {
	                String emailMessage = "Dear Voter,\n\n"
	                        + "The poll \"" + oldQuestion + "\" has been updated, and your previous votes have been removed.\n"
	                        + "Please revisit the poll to cast your vote again if needed.\n\n"
	                        + "Thank you,\nPoll Management System";

	                // Send Email to user
	                emailService.sendEmail(vote.getVoter().getEmail(), emailMessage, "Poll Update Notification");
	            }
	        }

	        pollDao.save(poll);
	        logger.info("Poll ID: {} successfully updated", poll.getId());

	    } catch (ResourceNotFoundException ex) {
	        logger.warn("Error occurred while updating Poll ID: {}: {}", updateRequest.getPollId(), ex.getMessage());
	        throw ex;
	    } catch (Exception ex) {
	        logger.error("An unexpected error occurred while updating Poll ID: {}: {}", updateRequest.getPollId(), ex.getMessage(), ex);
	        throw new RuntimeException("An unexpected error occurred: " + ex.getMessage(), ex);
	    }
	}

	@Override
	public void updatePollExpiry(Long pollId, LocalDateTime newExpiryDate) {
	    Logger logger = LoggerFactory.getLogger(this.getClass());
	    
	    logger.info("Received request to update expiry date for Poll with ID: {}", pollId);

	    try {
	        // Fetch the poll or throw exception if not found
	        Poll poll = pollDao.findById(pollId)
	                .orElseThrow(() -> {
	                    logger.warn("Poll not found with ID: {}", pollId);
	                    return new ResourceNotFoundException("Poll not found with ID: " + pollId);
	                });

	        logger.info("Poll found: {} with current expiry date: {}", pollId, poll.getExpiryDate());

	        // Check if the new expiry date is after the current expiry date
	        if (newExpiryDate.isBefore(poll.getExpiryDate())) {
	            logger.error("New expiry date {} is before the current expiry date {}", newExpiryDate, poll.getExpiryDate());
	            throw new IllegalArgumentException("New expiry date must be after the current expiry date.");
	        }

	        // Update the expiry date and set isActive to true
	        poll.setExpiryDate(newExpiryDate);
	        poll.setActive(true);
	        pollDao.save(poll);

	        logger.info("Poll ID: {} expiry date successfully updated to: {}", pollId, newExpiryDate);
	    } catch (ResourceNotFoundException ex) {
	        logger.warn("Error occurred while updating expiry for Poll ID: {}: {}", pollId, ex.getMessage());
	        throw ex;
	    } catch (IllegalArgumentException ex) {
	        logger.error("Invalid expiry date for Poll ID: {}: {}", pollId, ex.getMessage());
	        throw ex;
	    } catch (Exception ex) {
	        logger.error("An unexpected error occurred while updating expiry date for Poll ID: {}: {}", pollId, ex.getMessage(), ex);
	        throw new RuntimeException("An unexpected error occurred: " + ex.getMessage(), ex);
	    }
	}
	
	@Override
	public void stopPoll(Long pollId) {
	    Logger logger = LoggerFactory.getLogger(this.getClass());
	    
	    logger.info("Received request to stop Poll with ID: {}", pollId);

	    try {
	        // Fetch the poll or throw exception if not found
	        Poll poll = pollDao.findById(pollId)
	                .orElseThrow(() -> {
	                    logger.warn("Poll not found with ID: {}", pollId);
	                    return new ResourceNotFoundException("Poll not found with ID: " + pollId);
	                });

	        logger.info("Poll found: {} with question: {}", pollId, poll.getQuestion());

	        // Check if the poll is already inactive
	        if (!poll.isActive()) {
	            logger.warn("Poll ID: {} is already inactive.", pollId);
	            throw new IllegalStateException("Poll is already stopped.");
	        }

	        // Mark as inactive
	        poll.setActive(false);
	        pollDao.save(poll);
	        logger.info("Poll ID: {} has been successfully stopped.", pollId);
	    } catch (ResourceNotFoundException ex) {
	        logger.warn("Error occurred while stopping Poll ID: {}: {}", pollId, ex.getMessage());
	        throw ex;
	    } catch (IllegalStateException ex) {
	        logger.error("Error occurred while stopping Poll ID: {}: {}", pollId, ex.getMessage());
	        throw ex;
	    } catch (Exception ex) {
	        logger.error("An unexpected error occurred while stopping Poll ID: {}: {}", pollId, ex.getMessage(), ex);
	        throw new RuntimeException("An unexpected error occurred: " + ex.getMessage(), ex);
	    }
	}

	@Override
	public void resumePoll(Long pollId) {
	    Logger logger = LoggerFactory.getLogger(this.getClass());
	    
	    logger.info("Received request to resume Poll with ID: {}", pollId);

	    try {
	        // Fetch the poll or throw exception if not found
	        Poll poll = pollDao.findById(pollId)
	                .orElseThrow(() -> {
	                    logger.warn("Poll not found with ID: {}", pollId);
	                    return new ResourceNotFoundException("Poll not found with ID: " + pollId);
	                });

	        logger.info("Poll found: {} with question: {}", pollId, poll.getQuestion());

	        // Check if the poll has expired
	        if (poll.getExpiryDate().isBefore(LocalDateTime.now())) {
	            logger.warn("Poll ID: {} has expired and cannot be resumed.", pollId);
	            throw new IllegalStateException("Poll has expired and cannot be resumed. It will be automatically resumed when expiry date is extended.");
	        }

	        // Check if the poll is already active
	        if (poll.isActive()) {
	            logger.warn("Poll ID: {} is already active.", pollId);
	            throw new IllegalStateException("Poll is already resumed.");
	        }

	        // Mark as active
	        poll.setActive(true);
	        pollDao.save(poll);
	        logger.info("Poll ID: {} has been successfully resumed.", pollId);
	    } catch (ResourceNotFoundException ex) {
	        logger.warn("Error occurred while resuming Poll ID: {}: {}", pollId, ex.getMessage());
	        throw ex;
	    } catch (IllegalStateException ex) {
	        logger.error("Error occurred while resuming Poll ID: {}: {}", pollId, ex.getMessage());
	        throw ex;
	    } catch (Exception ex) {
	        logger.error("An unexpected error occurred while resuming Poll ID: {}: {}", pollId, ex.getMessage(), ex);
	        throw new RuntimeException("An unexpected error occurred: " + ex.getMessage(), ex);
	    }
	}
	
	//UPDATE OPERATIONS FINISHED 
	
	
	//DELETE OPERATION OF POLL
	
	@Override
	public ResponseEntity<?> deletePoll(Long id) {
	    Logger logger = LoggerFactory.getLogger(this.getClass());

	    logger.info("Received request to delete Poll with ID: {}", id);

	    try {
	        pollDao.deletePoll(id);
	        logger.info("Poll with ID: {} deleted successfully", id);
	        return new ResponseEntity<>("Poll with id " + id + " deleted successfully", HttpStatus.OK);
	    } catch (Exception ex) {
	        logger.error("An error occurred while deleting Poll ID: {}: {}", id, ex.getMessage(), ex);
	        return new ResponseEntity<>("Failed to delete Poll with id " + id, HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	}

}



