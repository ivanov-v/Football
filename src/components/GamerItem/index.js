import React from 'react';
import styled from 'styled-components';
import TrashIcon from '@atlaskit/icon/glyph/trash';
import PersonIcon from '@atlaskit/icon/glyph/person';

const Root = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #f0f0f0;
    padding: 5px 8px;
    border-radius: 4px;
    margin-bottom: 6px;
`;

const Main = styled.span`
    display: flex;
    align-items: center;
`;

const PersonIconStyled = styled.span`
    flex-shrink: 0;
    margin-right: 3px;
`;

export const GamerItem = ({onClick, name}) => {
    return (
        <Root>
            <Main>
                <PersonIconStyled>
                    <PersonIcon />
                </PersonIconStyled>
                <span>{name}</span>
            </Main>

            {onClick && <TrashIcon onClick={onClick} />}
        </Root>
    );
};