import React, {PureComponent} from 'react';
import styled, {keyframes} from 'styled-components';
import PersonIcon from '@atlaskit/icon/glyph/person';
import EditorErrorIcon from '@atlaskit/icon/glyph/editor/error';

const translate = keyframes`
    from {
        transform: translateX(-20px);
        opacity: 0;
    }

    to {
        transform: translateX(0);
        opacity: 1;
    }
`;

const Root = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #f0f0f0;
    padding: 7px;
    border-radius: 4px;
    margin-bottom: 6px;
    ${({hasAnimation}) => hasAnimation ? `animation: ${translate} 0.5s ease;` : ''}
`;

const Main = styled.span`
    display: flex;
    align-items: center;
`;

const PersonIconStyled = styled.span`
    flex-shrink: 0;
    margin-right: 3px;
`;

export class GamerItem extends PureComponent {
    render() {
        const {onClick, name} = this.props;
        const hasAnimation = Boolean(onClick);

        return (
            <Root hasAnimation={hasAnimation}>
                <Main>
                    <PersonIconStyled>
                        <PersonIcon />
                    </PersonIconStyled>
                    <span>{name}</span>
                </Main>

                {onClick && <EditorErrorIcon onClick={onClick} />}
            </Root>
        );
    }
}
