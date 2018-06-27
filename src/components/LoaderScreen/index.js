import React from 'react';
import styled from 'styled-components';
import Spinner from '@atlaskit/spinner';

const LoaderScreenStyled = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #039be5;
`;

export const LoaderScreen = () => (
    <LoaderScreenStyled>
        <Spinner size="xlarge" invertColor />
    </LoaderScreenStyled>
);