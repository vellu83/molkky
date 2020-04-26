import { Button, Popover, Timeline } from 'antd';
import React, { useState } from 'react';

type Play = {
  player: string;
  score: number;
};

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
        {plays
          .slice(Math.max(0, plays.length - 10), plays.length)
          .map((p) =>
            p.score > 0 ? (
              <Timeline.Item color='green'>
                {p.score > 1
                  ? `${p.player}: ${p.score} points`
                  : `${p.player}: ${p.score} point`}
              </Timeline.Item>
            ) : (
              <Timeline.Item color='red'>
                {`${p.player}: ${p.score} point`}
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
      <Button type='primary'>Last throws</Button>
    </Popover>
  );
};
