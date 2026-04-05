package com.example.collab.repositories;

import com.example.collab.entities.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task,Long> {
    List<Task> findByTaskColumnIdOrderByPositionAsc(Long columnId);
    Optional<Task> findByTitle(String title);
}
