package com.example.collab.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LabelDTO {

    private Long id ;
    private String name ;
    private String color ;

    private Long workspaceId;
}
