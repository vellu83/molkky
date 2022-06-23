
import styled from '@emotion/styled';
import React from 'react';


type Props = {
  value: number;
  onClickHandle: Function;
};


export const Skittle = ({ value, onClickHandle }: Props) => {


  return (
    <StyledButton

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
  background-image: url("karhu.png");
  background-size: 50px;
  border: none;
  color: blue;
  font-weight: bold;
  
`;
