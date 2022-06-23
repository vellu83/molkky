import { DownOutlined, SmileOutlined } from '@ant-design/icons';
import { Dropdown, Menu, Space } from 'antd';
import React from 'react';

const menu = (
  <Menu >
    <Menu.Item key='jallu'>
      <a>
        <img src="jallu.jpg" alt="suu napsaa" style={{ width: 70 }} />
      </a>
    </Menu.Item>
    <Menu.Item key='minttu'>
      <img src="minttu.png" alt="suu napsaa" style={{ width: 70 }} />
    </Menu.Item>
    <Menu.Item key='karhu'>
      <img src="karhu.png" alt="suu napsaa" style={{ width: 70 }} />
    </Menu.Item>
  </Menu>
);

const BottleList: React.FC = () => {

  const handleClick = (e:any) => {
    e.preventDefault()
    console.log(e)
  }

  return (
  <Dropdown overlay={menu}>
    <a onClick={handleClick} >
      <Space>
        Valitse kuva
        <DownOutlined />
      </Space>
    </a>
  </Dropdown>
  )
  };

export default BottleList