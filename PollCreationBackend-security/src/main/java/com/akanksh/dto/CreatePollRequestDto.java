// Updated CreatePollRequestDto
package com.akanksh.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreatePollRequestDto {
    private String question;
    private List<String> options;
    private boolean allowMultiple;
    private LocalDateTime expiryDateTime;
    private LocalDateTime createdAt;
    private String email;
}