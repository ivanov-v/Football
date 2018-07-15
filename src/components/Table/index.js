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
        border: 1px solid #e7e7e7;
    }
    
    thead {
        background-color: #f1f1f1;
    }
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
                        <tr key={item.id}>
                            <td>{position}</td>
                            <td>{item.name}</td>
                            <td>{item.rating}</td>
                        </tr>
                    );
                })}
            </tbody>
        </Root>
    );
};