import React, {PureComponent} from 'react';
import styled from 'styled-components';

const Root = styled.div`
    width: 100%;
    position: relative;
    height: 40px;
    background-color: #f0f0f0;
    border-radius: 3px;
    overflow: hidden;
`;

const Bar = styled.span`
    display: block;
    width: 100%;
    height: 100%;
    transform: translateX(${props => props.percent - 100}%);
    background-image: ${props => props.percent >= 83 ? 'linear-gradient( 109.6deg,  rgba(0,204,130,1) 11.2%, rgba(58,181,46,1) 91.7% )' : 'linear-gradient(to right, #fdc830, #f37335)'};
    transition: all 0.5s;
`;

const Caption = styled.span`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    text-align: center;
    font-size: 17px;
    font-weight: 500;
    line-height: 40px;
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
