import { Layout } from 'antd';
import React, { useState } from 'react';
import { AppFooter } from '../shared/AppFooter';
import { useStickyState } from '../shared/hook';
import { GameInProgress } from './GameInProgress';
import { NewGame } from './NewGame';
import BottleList from './BottleList'

const { Content } = Layout;

export type Player = string;

export const GamePage = () => {
  const [isPlaying, setPlaying] = useStickyState(false, 'is-playing');
  const [gamePoints, setGamePoints] = useStickyState(50, 'game-points');
  const [players, setPlayers] = useStickyState([] as Player[], 'players');
  const [lastPlayers, setLastPlayers] = useState<Player[]>([]);
  const [pullo, setPullo] = useState('jallu.jpg')



  const onGamePointsChangeHandle = (value: number) => {
    setGamePoints(value);
  };

  const onFinishHandle = (values: any) => {
    setPlayers(values.players);
    setPlaying(true);
  };

  const onNewGameHandle = () => {
    if (window.localStorage.getItem('players')?.length! > 1) {
      setLastPlayers(JSON.parse(window.localStorage.getItem('players')!));
    }
    window.localStorage.clear();
    setPlaying(false);
  };

  return (
    <Layout className='layout' style={{ height: '100vh', width: '100%' }}>
      <Content style={{ overflow: 'auto' }}>
        {!isPlaying ? (
          <>
            <NewGame
              lastPlayers={lastPlayers}
              onFinishHandle={onFinishHandle}
              onGamePointsChangeHandle={onGamePointsChangeHandle}
              pullo={pullo}
            ></NewGame>

          </>

        ) : (
          <GameInProgress
            gamePoints={gamePoints}
            players={players}
            onNewGameHandle={onNewGameHandle}
            pullo={pullo}
          ></GameInProgress>
        )}

        <BottleList setPullo={setPullo} />
      </Content>
      <AppFooter></AppFooter>
    </Layout>
  );
};
