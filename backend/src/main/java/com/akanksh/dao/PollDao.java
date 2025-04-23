package com.akanksh.dao;

import java.util.List;
import java.util.Optional;

import com.akanksh.entity.Poll;
import com.akanksh.entity.PollVote;
import com.akanksh.entity.User;

public interface PollDao {
	Poll createPoll(Poll poll);

	Optional<Poll> findById(Long pollId);

	List<Poll> findByCreatedBy(User user);

	void deletePoll(Long pollId);
	
	List<Poll> findPollsByCreatedByEmail(String email);
	
    List<PollVote> findByVoter(User user);

	
	List<Poll> findByIsActiveTrue();

	void save(Poll poll);
	
    void deleteVotesByPoll(Poll poll);

}
