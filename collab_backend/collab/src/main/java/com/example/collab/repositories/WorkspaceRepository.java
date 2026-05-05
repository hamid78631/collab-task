package com.example.collab.repositories;

import com.example.collab.entities.User;
import com.example.collab.entities.Workspace;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WorkspaceRepository extends JpaRepository<Workspace,Long> {
    List<Workspace> findByOwnerId(Long userId);
    Optional<Workspace> findByName(  String name);
    Optional<Workspace> findBySlug(  String slug);
}
