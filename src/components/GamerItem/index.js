import React from 'react';
import styled from 'styled-components';
import TrashIcon from '@atlaskit/icon/glyph/trash';

const GamerItemStyled = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #f0f0f0;
    padding: 5px 8px;
    border-radius: 4px;
    margin-bottom: 6px;
`;

export const GamerItem = ({onClick, name}) => {
    return (
        <GamerItemStyled>
            <span>{name}</span>
            <TrashIcon onClick={onClick} />
        </GamerItemStyled>
    );
};