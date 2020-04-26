import { Button } from 'antd';
import styled from '@emotion/styled';
import React from 'react';

type Props = {
  value: number;
  onClickHandle: Function;
};

export const Skittle = ({ value, onClickHandle }: Props) => {
  return (
    <StyledButton
      type='primary'
      shape='circle'
      size='large'
      onClick={() => onClickHandle(value)}
    >
      {value}
    </StyledButton>
  );
};

const StyledButton = styled(Button)`
  height: 50px;
  width: 50px;
  min-width: 50px;
  font-size: 20px;
  margin: 1px 2px;
`;
