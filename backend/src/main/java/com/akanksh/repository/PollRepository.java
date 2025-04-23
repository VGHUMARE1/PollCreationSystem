package com.akanksh.repository;

import com.akanksh.entity.Poll;
import com.akanksh.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PollRepository extends JpaRepository<Poll, Long> {

    List<Poll> findByCreatedBy(User user);
    
    List<Poll> findByCreatedByEmail(String email);
    
    List<Poll> findByIsActiveTrue();


}
