package com.example.collab.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name ="boards")
public class Board {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id ;
    private String title ;
    private String backgroundColor ;
    private Boolean isFavorite = false;

    @ManyToOne
    @JoinColumn(name = "workspace_id" , nullable = false)
    private Workspace workspace ;

    @OneToMany(mappedBy ="board", cascade = CascadeType.REMOVE)
    private List<TaskColumn> taskColumns ;
}
