package com.akanksh.dao.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.akanksh.dao.PollDao;
import com.akanksh.entity.Poll;
import com.akanksh.entity.PollVote;
import com.akanksh.entity.User;
import com.akanksh.repository.PollRepository;
import com.akanksh.repository.PollVoteRepository;

@Repository
public class PollDaoImpl implements PollDao {

    @Autowired
    private PollRepository pollRepository;

    @Autowired
    private PollVoteRepository pollVoteRepository;
    
    @Override
    public Poll createPoll(Poll poll) {
        return pollRepository.save(poll);
    }
    
    @Override
    public void save(Poll poll) {
        pollRepository.save(poll);
    }


    @Override
    public Optional<Poll> findById(Long pollId) {
        return pollRepository.findById(pollId);
    }

    @Override
    public List<Poll> findByCreatedBy(User user) {
        return pollRepository.findByCreatedBy(user);
    }

    @Override
    public void deletePoll(Long pollId) {
        pollRepository.deleteById(pollId);
    }
    
    @Override
    public List<Poll> findPollsByCreatedByEmail(String email) {
        return pollRepository.findByCreatedByEmail(email);
    }
    
    @Override
    public List<Poll> findByIsActiveTrue() {
        return pollRepository.findByIsActiveTrue();
    }
    
    @Override
    public List<PollVote> findByVoter(User user) {
        return pollVoteRepository.findByVoter(user);
    }

    @Override
    public void deleteVotesByPoll(Poll poll) {
        pollVoteRepository.deleteByPoll(poll);
    }
}
