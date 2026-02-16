package com.example.collab.web;

import com.example.collab.dtos.BoardDTO;
import com.example.collab.exceptions.BoardException;
import com.example.collab.exceptions.WorkspaceException;
import com.example.collab.services.BoardService;
import com.example.collab.services.BoardServiceImpl;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin("*")

@Transactional
@RestController
@RequestMapping("/api")
@AllArgsConstructor

public class BoardController {

    private BoardService boardService;

    @GetMapping("/board/{boardId}")
    public BoardDTO getBoard(@PathVariable Long boardId) throws BoardException {
        return boardService.getBoard(boardId);
    }

    @PostMapping("/board")
    public BoardDTO createBoard(@RequestBody BoardDTO boardDTO) throws BoardException {
        return boardService.createBoard(boardDTO);
    }

    @PutMapping("/board/{id}")
    public BoardDTO updateBoard(@PathVariable Long id , @RequestBody BoardDTO boardDTO) throws BoardException {
        return boardService.updateBoard(id, boardDTO);
    }

    @DeleteMapping("/board/{id}")
    public void deleteBoard(@PathVariable Long id) throws BoardException {
        boardService.deleteBoard(id);
    }

    @GetMapping("/allBoards/{WorkspaceId}")
    public List<BoardDTO> getBoards(@PathVariable Long WorkspaceId ) throws WorkspaceException, BoardException {

        return boardService.getBoards(WorkspaceId);
    }

    @PutMapping("/board/toggleFavorite/{id}")
    public void toggleIsFavorite(@PathVariable Long id) throws WorkspaceException, BoardException {
        boardService.toggleFavorite(id);
    }

    @PutMapping("/board/color/{id}")
    public void updateBoardColor(@PathVariable Long id, @RequestParam("color") String color) throws WorkspaceException, BoardException {
        boardService.updateBoardColor(id , color);
    }
}
