import { Layout } from 'antd';
import React from 'react';
import { AppFooter } from '../shared/AppFooter';
import styled from '@emotion/styled';
const { Content } = Layout;

export const StatsPage = () => {
  return (
    <Root>
      <Layout className='layout' style={{ width: '100%' }}>
        <Content>Leaderboard</Content>
        <AppFooter></AppFooter>
      </Layout>
    </Root>
  );
};

const Root = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2px;
`;
