package com.akanksh.dao.impl;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.akanksh.dao.UserDao;
import com.akanksh.entity.User;
import com.akanksh.repository.UserRepository;

@Repository
public class UserDaoImpl implements UserDao {
	
	@Autowired
	private UserRepository userRepository;

	@Override
	public Optional<User> getUserbyEmail(String email) {
		Optional<User> optionalUser = userRepository.findById(email); 
		return optionalUser;
	}

	@Override
	public User registerUser(User user) {		
		return userRepository.save(user);
	}

	@Override
	public Optional<User> getUserbyPhoneNo(String phoneNo) {
		return userRepository.findByPhoneNo(phoneNo);
	}

}
