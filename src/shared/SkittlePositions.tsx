import React from 'react';
import { Skittle } from './Skittle';
import styled from '@emotion/styled';

type Props = {
  onClickHandle: Function;
  pullo: string
};

export const SkittlePositions = ({ onClickHandle, pullo }: Props) => {
  return (
    <Root>
      <SkittleRow>
        <Skittle value={7} onClickHandle={onClickHandle} pullo={pullo}></Skittle>
        <Skittle value={9} onClickHandle={onClickHandle} pullo={pullo}></Skittle>
        <Skittle value={8} onClickHandle={onClickHandle} pullo={pullo}></Skittle>
      </SkittleRow>
      <SkittleRow>
        <Skittle value={5} onClickHandle={onClickHandle} pullo={pullo}></Skittle>
        <Skittle value={11} onClickHandle={onClickHandle} pullo={pullo}></Skittle>
        <Skittle value={12} onClickHandle={onClickHandle} pullo={pullo}></Skittle>
        <Skittle value={6} onClickHandle={onClickHandle} pullo={pullo}></Skittle>
      </SkittleRow>
      <SkittleRow>
        <Skittle value={3} onClickHandle={onClickHandle} pullo={pullo}></Skittle>
        <Skittle value={10} onClickHandle={onClickHandle} pullo={pullo}></Skittle>
        <Skittle value={4} onClickHandle={onClickHandle} pullo={pullo}></Skittle>
      </SkittleRow>
      <SkittleRow>
        <Skittle value={1} onClickHandle={onClickHandle} pullo={pullo}></Skittle>
        <Skittle value={2} onClickHandle={onClickHandle} pullo={pullo}></Skittle>
      </SkittleRow>
      <SkittleNullRow>
        <Skittle value={0} onClickHandle={onClickHandle} pullo={pullo}></Skittle>
      </SkittleNullRow>
    </Root>
  );
};

const Root = styled.div`
  margin: 18px;
`;

const SkittleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SkittleNullRow = styled.div`
  display: flex;
  justify-content: flex-end;
`;
