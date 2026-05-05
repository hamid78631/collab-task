package com.example.collab.repositories;

import com.example.collab.entities.WorkspaceMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WorkspaceMemberRepository extends JpaRepository<WorkspaceMember, Long > {

    Optional<WorkspaceMember> findByWorkspaceIdAndUserId(Long workspaceId, Long userId);

    List<WorkspaceMember> findByWorkspaceId(Long workspaceId);

    boolean existsByWorkspaceIdAndUserId(Long workspaceId, Long userId);

    List<WorkspaceMember> findByUserId(Long userId);
}
