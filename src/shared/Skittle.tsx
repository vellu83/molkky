
import styled from '@emotion/styled';
import React from 'react';


type Props = {
  value: number;
  onClickHandle: Function;
  pullo:string
};


export const Skittle = ({ value, onClickHandle, pullo }: Props) => {


  return (
    <StyledButton style={{backgroundImage:`url("${pullo}")`}}

      onClick={() => onClickHandle(value)}
    >
      {value}
    </StyledButton>
  );
};

const StyledButton = styled.button`
  height: 50px;
  width: 50px;
  min-width: 50px;
  font-size: 20px;
  margin: 1px 2px;
  background-size: 50px;
  border: none;
  color: blue;
  font-weight: bold;
  
`;
