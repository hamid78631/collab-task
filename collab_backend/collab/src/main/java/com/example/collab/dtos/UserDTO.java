package com.example.collab.dtos;

import com.example.collab.entities.Comment;
import com.example.collab.entities.Task;
import com.example.collab.entities.Workspace;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class UserDTO {

    private Long id ;
    private String name ;
    private String email ;
    private String avatarUrl ;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;
    private LocalDateTime createdAt ;


}
