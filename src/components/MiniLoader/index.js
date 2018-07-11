import React from 'react';
import styled from 'styled-components';
import Spinner from '@atlaskit/spinner';

const MiniLoaderStyled = styled.div`
    position: fixed;
    top: 21px;
    right: 22px;
    z-index: 100;
`;

export const MiniLoader = () => <MiniLoaderStyled><Spinner size="small" invertColor /></MiniLoaderStyled>;