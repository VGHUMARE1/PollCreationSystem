package com.akanksh.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Async	
    public void sendEmail(String recipientEmail, String message,  String subject) {
        try {
            // Create email
            SimpleMailMessage mailMessage = new SimpleMailMessage();
            mailMessage.setTo(recipientEmail);
            mailMessage.setSubject(subject);
            mailMessage.setText(message);

            // Send email
            mailSender.send(mailMessage);
            System.out.println("Email sent successfully to " + recipientEmail);
        } catch (MailException e) {
            System.err.println("Error sending email: " + e.getMessage());
        }
    }
}