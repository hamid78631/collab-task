package com.example.collab.dtos;

import com.example.collab.enums.EnumPriority;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.time.LocalDateTime;


@Data
@AllArgsConstructor
@NoArgsConstructor

public class TaskDTO {


    private Long id ;
    private String title ;
    private String description ;

    private EnumPriority priority ;
    private Integer position ;

    private LocalDateTime createdAt ;
    //Peut être dueDate aussi
    private LocalDateTime dueDate ;


    private Long taskColumnId;
    private Long assigneeId ;
}
