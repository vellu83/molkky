import React from 'react';
import { Button } from 'antd';

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
    >
      {value}
    </Button>
  );
};
