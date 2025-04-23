package com.akanksh.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Poll {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String question;

    private boolean allowMultipleSelect;

    private LocalDateTime expiryDate;

    private boolean isActive = true;

    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "created_by_email", referencedColumnName = "email", nullable = false)
    private User createdBy;

    @OneToMany(mappedBy = "poll", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PollOption> options;

    @OneToMany(mappedBy = "poll", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PollVote> votes;
}
