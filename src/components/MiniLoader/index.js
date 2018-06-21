import React from 'react';
import styled from 'styled-components';
import Spinner from '@atlaskit/spinner';

const MiniLoaderStyled = styled.div`
    position: fixed;
    top: 17px;
    right: 20px;
`;

export const MiniLoader = () => <MiniLoaderStyled><Spinner size="medium" /></MiniLoaderStyled>;