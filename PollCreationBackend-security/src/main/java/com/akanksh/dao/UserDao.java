package com.akanksh.dao;

import java.util.Optional;

import com.akanksh.entity.User;

public interface UserDao {

	Optional<User> getUserbyEmail(String email);
	
	User registerUser(User user);
	
	Optional<User> getUserbyPhoneNo(String phoneNo);
}
