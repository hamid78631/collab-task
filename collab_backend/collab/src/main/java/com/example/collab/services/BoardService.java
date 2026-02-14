package com.example.collab.services;

import com.example.collab.dtos.BoardDTO;
import com.example.collab.exceptions.BoardException;
import com.example.collab.exceptions.WorkspaceException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface BoardService {

    BoardDTO getBoard(Long id) throws BoardException;
    BoardDTO createBoard(BoardDTO boardDTO) throws BoardException;
    BoardDTO updateBoard(Long id, BoardDTO boardDTO) throws BoardException;
    void deleteBoard(Long id) throws BoardException;
    List<BoardDTO> getBoards(Long workspaceId) throws BoardException, WorkspaceException;

    void toggleFavorite(Long id) throws BoardException;

    void updateBoardColor(Long id, String color) throws BoardException;
}
