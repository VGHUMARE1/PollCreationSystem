package com.akanksh.dao.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.akanksh.dao.PollVoteDao;
import com.akanksh.entity.Poll;
import com.akanksh.entity.PollVote;
import com.akanksh.entity.User;
import com.akanksh.repository.PollVoteRepository;

@Repository
public class PollVoteDaoImpl implements PollVoteDao {

    @Autowired
    private PollVoteRepository pollVoteRepository;

    @Override
    public List<PollVote> findByPollId(Long pollId) {
        return pollVoteRepository.findByPollId(pollId);
    }

    @Override
    public List<PollVote> findByVoter(User voter) {
        return pollVoteRepository.findByVoter(voter);
    }

    @Override
    public Optional<PollVote> findByPollIdAndVoterEmail(Long pollId, String voterEmail) {
        return pollVoteRepository.findByPollIdAndVoterEmail(pollId, voterEmail);
    }

    @Override
    public PollVote saveVote(PollVote pollVote) {
        return pollVoteRepository.save(pollVote);
    }

    @Override
    public void deleteVotesByPollId(Long pollId) {
        List<PollVote> votes = pollVoteRepository.findByPollId(pollId);
        pollVoteRepository.deleteAll(votes);
    }
    
    @Override
    public boolean existsByPollAndVoter(Poll poll, User voter) {
        return pollVoteRepository.existsByPollAndVoter(poll, voter);
    }
    
    @Override
    public List<PollVote> findByPoll(Poll poll) {
        return pollVoteRepository.findByPoll(poll);
    }
    
    @Override
    public List<PollVote> findByPollAndVoter(Poll poll, User voter) {
        return pollVoteRepository.findByPollAndVoter(poll, voter);
    }
    
    @Override
    public void deleteVotesByPollAndVoter(Poll poll, User voter) {
        pollVoteRepository.deleteByPollAndVoter(poll, voter);
    }


    
}
