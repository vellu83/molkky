import { Layout } from 'antd';
import React, { useState } from 'react';
import { AppFooter } from '../shared/AppFooter';
import { GameInProgress } from './GameInProgress';
import { NewGame } from './NewGame';

const { Content } = Layout;

export type Player = {
  name: string;
  points: number;
  lastThrow: number;
  wins: number;
};

export const GamePage = () => {
  const [isPlaying, setPlaying] = useState(false);
  const [gamePoints, setGamePoints] = useState(50);
  const [players, setPlayers] = useState<Player[]>([]);

  const onGamePointsChangeHandle = (value: number) => {
    setGamePoints(value);
  };

  const onFinishHandle = (values: any) => {
    setPlayers(values.players.map((v: string) => ({ name: v })));
    setPlaying(true);
  };

  const onPlayAgain = (values: any) => {
    setPlaying(false);
    setPlayers([]);
    setGamePoints(50);
  };

  return (
    <Layout className='layout' style={{ height: '100vh' }}>
      <Content style={{ overflow: 'auto' }}>
        {!isPlaying ? (
          <NewGame
            onFinishHandle={onFinishHandle}
            onGamePointsChangeHandle={onGamePointsChangeHandle}
          ></NewGame>
        ) : (
          <GameInProgress
            gamePoints={gamePoints}
            players={players}
            onPlayAgainHandle={onPlayAgain}
          ></GameInProgress>
        )}
      </Content>
      <AppFooter></AppFooter>
    </Layout>
  );
};
