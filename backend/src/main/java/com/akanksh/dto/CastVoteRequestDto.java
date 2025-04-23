package com.akanksh.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CastVoteRequestDto {

    private Long pollId;
    private List<Long> optionIds; // For multiple selections
    private String voterEmail;
}
