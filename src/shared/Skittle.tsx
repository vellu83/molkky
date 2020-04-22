import { Button } from 'antd';
import React, { CSSProperties } from 'react';

type Props = {
  value: number;
  onClickHandle: Function;
};

export const Skittle = ({ value, onClickHandle }: Props) => {
  return (
    <Button
      type='primary'
      shape='circle'
      size='large'
      onClick={() => onClickHandle(value)}
      style={ButtonStyle}
    >
      {value}
    </Button>
  );
};

const ButtonStyle = {
  height: '50px',
  minWidth: '50px',
  fontSize: '20px',
} as CSSProperties;
