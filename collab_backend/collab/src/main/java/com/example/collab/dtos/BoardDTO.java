package com.example.collab.dtos;

import com.example.collab.entities.TaskColumn;
import com.example.collab.entities.Workspace;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class BoardDTO {

    private Long id ;
    private String title ;
    private String backgroundColor ;
    private Boolean isFavorite = false;

    private Long workspaceId;

}
