import React from 'react';
import styled from 'styled-components'
import {INote} from "./note.types";
import {BaseInput} from "../../common/base-input/base-input.component";


export const Note: React.FC<INote> = ({title, content, imageLink, updatedAt}) => {
    return (
        <NoteWrapper>
            <BaseInput value={title} label="Title" disabled/>
            <BaseInput value={content} label="Content" disabled/>

            {imageLink && <img src={imageLink}></img>}
            {updatedAt && <UpdatedAt>updatedAt</UpdatedAt>}
        </NoteWrapper>
    );
};

const NoteWrapper = styled.div`
    padding: 20px;
    border: 1px solid black;
    background-color: beige;
    display: flex;
    flex-direction: column;
    gap: 30px;
    max-width: 578px;
`

const UpdatedAt = styled.div`
  color: grey;
  font-size: 12px;
`