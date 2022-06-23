import { DownOutlined, SmileOutlined } from '@ant-design/icons';
import { Dropdown, Menu, Space } from 'antd';
import React from 'react';


type BottleProps = {
  setPullo: Function
}

const BottleList = ({ setPullo }: BottleProps) => {

  const menu = (
    <Menu >
      <Menu.Item key='jallu'>
        <a>
          <img src="jallu.jpg" alt="suu napsaa" style={{ width: 70 }} onClick={() => setPullo('jallu.jpg')} />
        </a>
      </Menu.Item>
      <Menu.Item key='minttu'>
        <img src="minttu.png" alt="suu napsaa" style={{ width: 70 }} onClick={() => setPullo('minttu.png')} />
      </Menu.Item>
      <Menu.Item key='karhu'>
        <img src="karhu.png" alt="suu napsaa" style={{ width: 70 }} onClick={() => setPullo('karhu.png')} />
      </Menu.Item>
    </Menu>
  );


  return (
    <div style={{ display: 'flex', justifyContent: 'center' }} >
      <Dropdown overlay={menu}>
        <Space>
          Select picture
          <DownOutlined />
        </Space>
      </Dropdown>
    </div>
  )
};

export default BottleList