package com.akanksh.dao.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.akanksh.dao.PollOptionDao;
import com.akanksh.entity.PollOption;
import com.akanksh.repository.PollOptionRepository;


@Repository
public class PollOptionDaoImpl implements PollOptionDao {
	

    @Autowired
    private PollOptionRepository pollOptionRepository;

    @Override
    public List<PollOption> findByPollId(Long pollId) {
        return pollOptionRepository.findByPollId(pollId);
    }

    @Override
    public Optional<PollOption> findById(Long optionId) {
        return pollOptionRepository.findById(optionId);
    }

    @Override
    public List<PollOption> saveAll(List<PollOption> options) {
        return pollOptionRepository.saveAll(options);
    }
    
    @Override
    public List<PollOption> findAllById(List<Long> ids) {
        return pollOptionRepository.findAllByIdIn(ids);
    }

}