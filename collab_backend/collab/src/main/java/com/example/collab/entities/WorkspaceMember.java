package com.example.collab.entities;

import com.example.collab.enums.WorkspaceRole;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "workspace_members")
public class WorkspaceMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "workspace_id" , nullable = false)
    private Workspace workspace ;

    @ManyToOne
    @JoinColumn(name = "user_id" ,nullable = false)
    private User user ;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private WorkspaceRole role ;

}
