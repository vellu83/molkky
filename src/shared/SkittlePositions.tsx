import React from 'react';
import { Skittle } from './Skittle';
import styled from '@emotion/styled';

type Props = {
  onClickHandle: Function;
};

export const SkittlePositions = ({ onClickHandle }: Props) => {
  return (
    <Root>
      <SkittleRow>
        <Skittle value={7} onClickHandle={onClickHandle}></Skittle>
        <Skittle value={9} onClickHandle={onClickHandle}></Skittle>
        <Skittle value={8} onClickHandle={onClickHandle}></Skittle>
      </SkittleRow>
      <SkittleRow>
        <Skittle value={5} onClickHandle={onClickHandle}></Skittle>
        <Skittle value={11} onClickHandle={onClickHandle}></Skittle>
        <Skittle value={12} onClickHandle={onClickHandle}></Skittle>
        <Skittle value={6} onClickHandle={onClickHandle}></Skittle>
      </SkittleRow>
      <SkittleRow>
        <Skittle value={3} onClickHandle={onClickHandle}></Skittle>
        <Skittle value={10} onClickHandle={onClickHandle}></Skittle>
        <Skittle value={4} onClickHandle={onClickHandle}></Skittle>
      </SkittleRow>
      <SkittleRow>
        <Skittle value={1} onClickHandle={onClickHandle}></Skittle>
        <Skittle value={2} onClickHandle={onClickHandle}></Skittle>
      </SkittleRow>
      <SkittleNullRow>
        <Skittle value={0} onClickHandle={onClickHandle}></Skittle>
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
