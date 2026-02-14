package com.example.collab.dtos;


import com.example.collab.entities.Board;
import com.example.collab.entities.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;


@Data
@AllArgsConstructor
@NoArgsConstructor

public class WorkspaceDTO {

    private Long id ;
    private String name ;
    private String description ;
    private String slug ;

    private Long ownerId ;

   // private String ownerName;

}
