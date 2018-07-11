import React from 'react';
import styled from 'styled-components';
import {Ball} from '../Ball';

const LoaderScreenStyled = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-image: linear-gradient(111.5deg, rgba(20,100,196,1) 0.4%, rgba(33,152,214,1) 100.2%);
`;

const LoaderBall = styled(Ball)`
    width: 90px;
`;

export const LoaderScreen = () => (
    <LoaderScreenStyled>
        <LoaderBall loading />
    </LoaderScreenStyled>
);