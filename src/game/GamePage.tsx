import { Layout } from 'antd';
import React from 'react';
import { AppFooter } from '../shared/AppFooter';
import { GameInProgress } from './GameInProgress';
import { NewGame } from './NewGame';
import { useStickyState } from '../shared/hook';

const { Content } = Layout;

export type Player = string;

export const GamePage = () => {
  const [isPlaying, setPlaying] = useStickyState(false, 'is-playing');
  const [gamePoints, setGamePoints] = useStickyState(50, 'game-points');
  const [players, setPlayers] = useStickyState([] as Player[], 'players');

  const onGamePointsChangeHandle = (value: number) => {
    setGamePoints(value);
  };

  const onFinishHandle = (values: any) => {
    setPlayers(values.players);
    setPlaying(true);
  };

  const onPlayAgain = (values: any) => {
    setPlaying(false);
    setPlayers([]);
    setGamePoints(50);
  };

  return (
    <Layout className='layout' style={{ height: '100vh', width: '100%' }}>
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
