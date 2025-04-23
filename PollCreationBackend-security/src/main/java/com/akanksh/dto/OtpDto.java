package com.akanksh.dto;

import com.akanksh.enums.OtpPurpose;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OtpDto {
	
	private String email;
    private String otp;
    private OtpPurpose purpose;  // Purpose of OTP (FORGOT_PASSWORD, REGISTERATION)
    

}
