package com.example.collab.repositories;

import com.example.collab.entities.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task,Long> {
    List<Task> findByTaskColumnIdOrderByPositionAsc(Long columnId);
}
