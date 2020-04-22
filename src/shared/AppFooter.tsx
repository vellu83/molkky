import { FileTextOutlined, SmileOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const { Footer } = Layout;

export const AppFooter = () => {
  const location = useLocation();
  return (
    <Footer>
      <Menu
        mode='horizontal'
        selectedKeys={[
          location.pathname.endsWith('/')
            ? 'game'
            : location.pathname.split('/')[1],
        ]}
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
