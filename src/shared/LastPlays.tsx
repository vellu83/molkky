import React, { useState } from 'react';
import { Popover, Button, Timeline } from 'antd';
import { Play } from '../game/GameInProgress';

type Props = {
  plays: Play[];
};

export const LastPlays = ({ plays }: Props) => {
  const [visible, setVisible] = useState(false);
  const hide = () => {
    setVisible(false);
  };

  const handleVisibleChange = (visible: boolean) => {
    setVisible(visible);
  };

  const content = (
    <div>
      <Timeline mode='left'>
        {plays.slice(Math.max(0, plays.length - 10), plays.length).map((p) =>
          p.score > 0 ? (
            <Timeline.Item color='green' label={p.player.name}>
              {p.score > 1 ? `${p.score} points` : `${p.score} point`}
            </Timeline.Item>
          ) : (
            <Timeline.Item color='red' label={p.player.name}>
              {`${p.score} points`}
            </Timeline.Item>
          )
        )}
      </Timeline>
      <a onClick={hide}>Close</a>
    </div>
  );
  return (
    <Popover
      content={content}
      title='Last plays'
      trigger='click'
      visible={visible}
      onVisibleChange={handleVisibleChange}
    >
      <Button type='primary'>Show last plays</Button>
    </Popover>
  );
};
