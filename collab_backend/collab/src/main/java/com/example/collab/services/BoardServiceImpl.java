package com.example.collab.services;

import com.example.collab.dtos.BoardDTO;
import com.example.collab.entities.Board;
import com.example.collab.entities.Workspace;
import com.example.collab.exceptions.BoardException;
import com.example.collab.exceptions.WorkspaceException;
import com.example.collab.mappers.BoardMappers;
import com.example.collab.repositories.BoardRepository;
import com.example.collab.repositories.WorkspaceRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
@Transactional
@AllArgsConstructor
public class BoardServiceImpl implements BoardService {


    private BoardMappers dtoMapper ;
    private BoardRepository boardRepository;
    private WorkspaceRepository workspaceRepository;


    @Override
    public BoardDTO getBoard(Long id) throws BoardException {
        Board board = boardRepository.findById(id).orElseThrow(() -> new BoardException("Board not found"));

        return dtoMapper.boardToBoardDTO(board);
    }


    @Override
    public BoardDTO createBoard(BoardDTO boardDTO) throws BoardException {
        Board board = dtoMapper.boardDTOToBoard(boardDTO);

        Workspace workspace = workspaceRepository.findById(boardDTO.getWorkspaceId()).orElseThrow(() -> new BoardException("Workspace not found"));
        board.setWorkspace(workspace);
        Board saveBoard = boardRepository.save(board);

        return dtoMapper.boardToBoardDTO(saveBoard);
    }

    @Override
    public BoardDTO updateBoard(Long id, BoardDTO boardDTO) throws BoardException {
        Board board =  boardRepository.findById(id).orElseThrow(() -> new BoardException("Board not found"));

        board.setTitle(boardDTO.getTitle());
        board.setBackgroundColor(boardDTO.getBackgroundColor());
        board.setIsFavorite(boardDTO.getIsFavorite());

        Board saveBoard = boardRepository.save(board);

        return dtoMapper.boardToBoardDTO(saveBoard);
    }

    @Override
    public void deleteBoard(Long id) throws BoardException {
        Board board =  boardRepository.findById(id).orElseThrow(() -> new BoardException("Board not found"));
        boardRepository.delete(board);
    }

    @Override
    public List<BoardDTO> getBoards(Long workspaceId) throws WorkspaceException {
        Workspace workspace =  workspaceRepository.findById(workspaceId).orElseThrow(() -> new WorkspaceException("Workspace not found"));
        List<Board> boards = workspace.getBoards();
        return boards.stream().map(board -> dtoMapper.boardToBoardDTO(board)).toList();
    }

    @Override
    public void toggleFavorite(Long id) throws BoardException {
        Board board = boardRepository.findById(id).orElseThrow(()-> new BoardException("Board not found"));
        board.setIsFavorite(!board.getIsFavorite());
        boardRepository.save(board);
    }
    @Override
    public void updateBoardColor(Long id, String color) throws BoardException {
        Board board = boardRepository.findById(id).orElseThrow(()-> new BoardException("Board not found"));
        board.setBackgroundColor(color);
        boardRepository.save(board);
    }
}
