package com.example.collab.entities;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@Table(name = "workspaces")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Workspace {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id ;
    private String name ;
    private String description ;
    //@Column(unique = true)
    private String slug ;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User owner ;

    @OneToMany(mappedBy = "workspace")
    private List<Board> boards ;
}
