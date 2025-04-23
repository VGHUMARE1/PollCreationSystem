package com.akanksh.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdatePollRequestDto {
    private Long pollId;  // Now included in the request body
    private String question;
    private Boolean allowMultipleSelect;
    private List<OptionDto> options;
}
