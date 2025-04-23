package com.akanksh.entity;

import java.sql.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {
	
	@Id
	private String email;
	
	private String password;
	
	private String phoneNo;
	
	private String firstName;
	
	private String lastName;
	

}
