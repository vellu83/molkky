import {
  BarChartOutlined,
  FileTextOutlined,
  SmileOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const { Footer } = Layout;

export const AppFooter = () => {
  return (
    <Footer>
      <Menu
        mode='horizontal'
        style={{ display: 'flex', justifyContent: 'space-between' }}
      >
        <Menu.Item key='game'>
          <SmileOutlined />
          <span>Game</span>
          <Link to='/' />
        </Menu.Item>
        <Menu.Item key='rules'>
          <FileTextOutlined />
          <span>Rules</span>
          <Link to='/rules' />
        </Menu.Item>
      </Menu>
    </Footer>
  );
};

// <Menu.Item key='stats'>
//           <BarChartOutlined />
//           <span>Stats</span>
//           <Link to='/stats' />
//         </Menu.Item>
