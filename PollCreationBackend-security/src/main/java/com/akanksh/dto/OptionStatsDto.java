package com.akanksh.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OptionStatsDto {
    private Long id;
    private Long pollId;
    private String optionText;
    private int votes;
}
