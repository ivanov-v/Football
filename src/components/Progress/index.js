import React from 'react';
import styled from 'styled-components';

const Root = styled.div`
    width: 100%;
    position: relative;
    height: 35px;
    background-color: #f0f0f0;
    border-radius: 3px;
    overflow: hidden;
`;

const Inner = styled.div`
    height: 100%;
    width: ${props => props.percent}%;
    background-color: ${props => props.percent >= 83 ? '#33cd7b' : '#FFAB00'};
    transition: width 0.5s;
`;

const Caption = styled.span`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    text-align: center;
    font-size: 15px;
    line-height: 35px;
    z-index: 1;
    color: ${props => props.percent >= 55 ? '#fff' : 'rgb(68, 68, 68)'};
`;

export const Progress = ({caption, percent}) => {
    return (
        <Root>
            <Inner percent={percent}>
                <Caption percent={percent}>{caption}</Caption>
            </Inner>
        </Root>
    );
};