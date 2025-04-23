package com.akanksh.dao;

import java.util.List;
import java.util.Optional;

import com.akanksh.entity.Poll;
import com.akanksh.entity.PollVote;
import com.akanksh.entity.User;

public interface PollVoteDao {
	List<PollVote> findByPollId(Long pollId);

	List<PollVote> findByVoter(User voter);

	Optional<PollVote> findByPollIdAndVoterEmail(Long pollId, String voterEmail);

	PollVote saveVote(PollVote pollVote);

	void deleteVotesByPollId(Long pollId);

	boolean existsByPollAndVoter(Poll poll, User voter);
	
    List<PollVote> findByPoll(Poll poll); // Add this method
    
    List<PollVote> findByPollAndVoter(Poll poll, User voter);

	void deleteVotesByPollAndVoter(Poll poll, User voter);


}