package com.akanksh.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.akanksh.entity.User;

public interface UserRepository extends JpaRepository<User, String>{

	Optional<User> findByPhoneNo(String phoneNo);
}
