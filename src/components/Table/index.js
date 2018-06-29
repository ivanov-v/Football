import React from 'react';
import styled from 'styled-components';

const Root = styled.table`
    width: 100%;
    max-width: 100%;
    border-collapse: collapse;
    background-color: transparent;
    text-align: left;
    
    td,
    th {
        padding: 8px 12px;
        border: 1px solid rgba(0, 0, 0, 0.12);
    }
`;

const Row = styled.tr`
    background-color: ${props => props.active ? 'rgba(3, 155, 229, 0.09)' : 'transparent'};
`;

export const Table = ({titles, items}) => {
    return (
        <Root>
            <thead>
                <tr>
                    {titles.map(title => {
                        return (
                            <th key={title}>{title}</th>
                        );
                    })}
                </tr>
            </thead>
            <tbody>
                {items.map((item, index) => {
                    const position = index + 1;

                    return (
                        <Row key={item.id} active={position <= 12}>
                            <td>{position}</td>
                            <td>{item.name}</td>
                            <td>{item.rating}</td>
                        </Row>
                    );
                })}
            </tbody>
        </Root>
    );
};