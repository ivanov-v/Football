import React, {PureComponent} from 'react';
import styled from 'styled-components';

const Root = styled.div`
    width: 100%;
    position: relative;
    height: 35px;
    background-color: #f0f0f0;
    border-radius: 3px;
    overflow: hidden;
`;

const Bar = styled.span`
    display: block;
    width: 100%;
    height: 100%;
    transform: translateX(${props => props.percent - 100}%);
    background-color: ${props => props.percent >= 83 ? '#33cd7b' : '#FFAB00'};
    transition: all 0.5s;
`;

const Caption = styled.span`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    text-align: center;
    font-size: 15px;
    font-weight: 500;
    line-height: 35px;
    z-index: 1;
    color: ${props => props.percent >= 55 ? '#fff' : 'rgb(68, 68, 68)'};
`;

export class Progress extends PureComponent {
    render() {
        const {caption, percent} = this.props;

        return (
            <Root>
                <Bar percent={percent} />
                <Caption percent={percent}>{caption}</Caption>
            </Root>
        );
    }
}
