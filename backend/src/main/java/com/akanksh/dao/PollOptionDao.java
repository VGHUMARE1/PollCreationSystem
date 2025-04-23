package com.akanksh.dao;

import java.util.List;
import java.util.Optional;

import com.akanksh.entity.PollOption;

public interface PollOptionDao {
	List<PollOption> findByPollId(Long pollId);

	Optional<PollOption> findById(Long optionId);

	List<PollOption> saveAll(List<PollOption> options);
	
	List<PollOption> findAllById(List<Long> ids);

}
