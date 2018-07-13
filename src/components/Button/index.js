import React, {PureComponent} from 'react';
import styled from 'styled-components';

const Root = styled.button`
    display: block;
    width: ${({fit}) => fit ? 'auto' : '100%'};
    padding: 14px;
    margin: 0;
    border: none;
    outline: none;
    appearance: none;
    background-image: linear-gradient( 111.5deg,rgba(20,100,196,1) 0.4%,rgba(33,152,214,1) 100.2% );
    color: #fff;
    font-weight: 700;
    font-family: inherit;
    text-transform: uppercase;
    border-radius: 3px;
    font-size: 14px;
    font-family: inherit;
    cursor: ${({disabled}) => disabled ? 'default' : 'pointer'};
    box-shadow: 0 0 13px 0 rgba(28, 132, 208, 0.5);
    opacity: ${({disabled}) => disabled ? '0.3' : '1'};
    transition: all 0.3s ease;
`;

export class Button extends PureComponent {
    static defaultProps = {
        onClick: () => {}
    };

    render() {
        const {className, children, disabled, onClick, fit} = this.props;

        return (
            <Root
                type="button"
                disabled={disabled}
                onClick={onClick}
                className={className}
                fit={fit}
                disabled={disabled}
            >
                {children}
            </Root>
        );
    }
}