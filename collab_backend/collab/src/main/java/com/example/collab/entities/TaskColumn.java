package com.example.collab.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@Table(name ="tasks_columns")
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskColumn {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id ;
    private String name ;
    private Integer position ;

    @ManyToOne
    @JoinColumn(name = "board_id" , nullable = false)
    private Board board ;

    @OneToMany(mappedBy = "taskColumn", cascade = CascadeType.REMOVE)
    private List<Task> tasks ;
}
