package com.example.collab.repositories;

import com.example.collab.entities.Board;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BoardRepository extends JpaRepository<Board,Long> {
    List<Board> findByWorkspaceId(Long workspaceId);
}
