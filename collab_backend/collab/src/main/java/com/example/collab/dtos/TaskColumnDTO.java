package com.example.collab.dtos;

import com.example.collab.entities.Board;
import com.example.collab.entities.Task;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskColumnDTO {


    private Long id ;
    private String name ;
    private Integer position ;

    private Long boardId ;

}
