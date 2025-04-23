package com.akanksh.controller;

import com.akanksh.dto.EmailRequest;
import com.akanksh.service.impl.EmailService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/email")
@CrossOrigin
public class EmailController {

    @Autowired
    private EmailService emailService;

    @PostMapping("/send")
    public ResponseEntity<String> sendEmail(@RequestBody EmailRequest emailRequest) {
        
        emailService.sendEmail(emailRequest.getEmail(), emailRequest.getMessage(), emailRequest.getSubject());
        
        return ResponseEntity.ok("Email sent successfully to " + emailRequest.getEmail());
    }
}
