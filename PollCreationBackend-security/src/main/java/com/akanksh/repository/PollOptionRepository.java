package com.akanksh.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.akanksh.entity.Poll;
import com.akanksh.entity.PollOption;
import com.akanksh.entity.User;

public interface PollOptionRepository extends JpaRepository<PollOption, Long> {

    List<PollOption> findByPollId(Long pollId);

    
    List<PollOption> findAllByIdIn(List<Long> ids);
}
