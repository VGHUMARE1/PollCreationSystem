package com.akanksh.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.akanksh.entity.Poll;
import com.akanksh.entity.PollVote;
import com.akanksh.entity.User;

public interface PollVoteRepository extends JpaRepository<PollVote, Long> {

    List<PollVote> findByPollId(Long pollId);

    List<PollVote> findByVoter(User voter);

    Optional<PollVote> findByPollIdAndVoterEmail(Long pollId, String voterEmail);
    
    boolean existsByPollAndVoter(Poll poll, User voter); 
    
    List<PollVote> findByPoll(Poll poll);
    
    List<PollVote> findByPollAndVoter(Poll poll, User voter);

    void deleteByPollAndVoter(Poll poll, User voter);
    
    void deleteByPoll(Poll poll);


}
