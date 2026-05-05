package com.example.collab.dtos;

import com.example.collab.enums.EnumPriority;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;


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
    private LocalDate dueDate ;


    private Long taskColumnId;
    private Long assigneeId ;
    private Long boardId ;
    private List<LabelDTO> labels ;
}
