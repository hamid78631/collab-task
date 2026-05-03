package com.example.collab.repositories;

import com.example.collab.entities.Label;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LabelRepository extends JpaRepository<Label, Long> {
    List<Label> findByWorkspaceId(Long workspaceId);
}
