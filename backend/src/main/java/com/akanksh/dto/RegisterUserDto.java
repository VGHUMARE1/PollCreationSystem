package com.akanksh.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterUserDto {
	
	private String email;
	private String password;
    private String phoneNo;
    private String firstName;
    private String lastName;

}
