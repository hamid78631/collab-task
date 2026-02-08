package com.example.collab.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Fetch;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "users")
public class User {
    @Id @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id ;
    private String name ;
    @Email
    //@Column(unique = true , nullable = false)
    private String email ;
    //@Column(unique = true , nullable = false)

    private String password ;
    private String avatarUrl ;
    @CreationTimestamp
    private LocalDateTime createdAt ;

    @OneToMany(mappedBy = "owner",cascade = CascadeType.REMOVE)
    private List<Workspace> workspaces ;

    @OneToMany(mappedBy = "author" ,cascade = CascadeType.REMOVE)
    private List<Comment> comments ;

    @OneToMany(mappedBy = "assignee",cascade = CascadeType.REMOVE)
    private List<Task> tasks ;
}
