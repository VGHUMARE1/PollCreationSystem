package com.akanksh;

import java.util.Properties;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
@EnableScheduling
@EnableAsync
@EnableWebSecurity  // ✅ REQUIRED to enable security features
public class PollCreationBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(PollCreationBackendApplication.class, args);
	}
	
	@Bean
	ModelMapper getMapper() {
		return new ModelMapper();
	}
	
	@Bean
	BCryptPasswordEncoder getEncoder() {
		return new BCryptPasswordEncoder();
	}
	
	@Bean
	public JavaMailSender getJavaMailSender(@Value("${spring.mail.username}") String username,
	                                         @Value("${spring.mail.password}") String password,
	                                         @Value("${spring.mail.host}") String host,
	                                         @Value("${spring.mail.port}") int port) {
	    JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
	    mailSender.setHost(host);
	    mailSender.setPort(port);
	    mailSender.setUsername(username);
	    mailSender.setPassword(password);

	    Properties props = mailSender.getJavaMailProperties();
	    props.put("mail.transport.protocol", "smtp");
	    props.put("mail.smtp.auth", "true");
	    props.put("mail.smtp.starttls.enable", "true");
	    props.put("mail.debug", "true");

	    return mailSender;
	}
}
