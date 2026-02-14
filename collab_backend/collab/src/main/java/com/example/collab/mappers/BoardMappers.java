package com.example.collab.mappers;

import com.example.collab.dtos.BoardDTO;
import com.example.collab.entities.Board;
import com.example.collab.exceptions.BoardException;
import org.springframework.beans.BeanUtils;

public class BoardMappers {

    public BoardDTO boardToBoardDTO(Board board) {
        BoardDTO boardDTO = new BoardDTO();
        BeanUtils.copyProperties(board, boardDTO);
        if(board.getWorkspace()!=null){
            boardDTO.setWorkspaceId(board.getWorkspace().getId());
        }
        return boardDTO;
    }

    public Board boardDTOToBoard(BoardDTO boardDTO) throws BoardException {
        Board board = new Board();
        BeanUtils.copyProperties(boardDTO, board);

        return board;
    }
}
