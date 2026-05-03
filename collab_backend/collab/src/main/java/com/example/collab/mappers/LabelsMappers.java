package com.example.collab.mappers;

import com.example.collab.dtos.LabelDTO;
import com.example.collab.entities.Label;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

@Component
public class LabelsMappers {

    public LabelDTO labelToLabelDTO(Label label){
        LabelDTO labelDTO = new LabelDTO();
        BeanUtils.copyProperties(label , labelDTO);
        if(label.getWorkspace().getId() != null){
            labelDTO.setWorkspaceId(label.getWorkspace().getId());
        }

        return labelDTO ;
    }
}
