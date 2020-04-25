import styled from '@emotion/styled';
import { Layout, Result, Button, Modal } from 'antd';
import Title from 'antd/lib/typography/Title';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { LastPlays } from '../shared/LastPlays';
import { Leaderboard } from '../shared/Leaderboard';
import { SkittlePositions } from '../shared/SkittlePositions';
import { SmileOutlined, UndoOutlined } from '@ant-design/icons';
import { Player } from './GamePage';

const { Content } = Layout;

const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * Math.floor(max));
};

export type Play = {
  player: string;
  score: number;
};

export type GameState = Map<Player, PlayerState>;

type PlayerState = {
  totalScore: number;
  missStrike: number;
  score: number;
  isCurrentPlayer: boolean;
  isEliminated: Boolean;
  hasWon: Boolean;
};

type Props = {
  gamePoints: number;
  players: Player[];
  onPlayAgainHandle: Function;
};

export const GameInProgress = ({
  gamePoints,
  players,
  onPlayAgainHandle,
}: Props) => {
  const [currentPlayer, setCurrentPlayer] = useState<Player>(
    players[getRandomInt(players.length)]
  );
  const [gameHistory, setGameHistory] = useState<GameState[]>([]);
  const [winner, setWinner] = useState<Player>('');

  useEffect(() => {
    const initialGameStep = new Map<Player, PlayerState>();
    players.forEach((player) =>
      initialGameStep.set(player, {
        totalScore: 0,
        score: 0,
        missStrike: 0,
        isCurrentPlayer: player === currentPlayer,
        isEliminated: false,
        hasWon: false,
      })
    );
    setGameHistory([initialGameStep]);
  }, [players]);

  const gameHistoryRef = useRef(gameHistory);
  useEffect(() => {
    const gameHistory = gameHistoryRef.current;
    const gameState = gameHistory[gameHistory.length - 1];
    
    if (!gameState) {
      return;
    }
    
    const currentPlayerState = gameState.get(currentPlayer)!;
    warnVlugul(currentPlayerState);
  }, [currentPlayer]);

  useEffect(() => {
    const gameState = gameHistory[gameHistory.length - 1];
    if (!gameState) {
      return;
    }
    isGameFinished(gameState);
    nextTurn(gameState);
  }, [gameHistory]);

  const setWinnerPlayer = (playerState: PlayerState) => {
    return {
      ...playerState,
      hasWon: true,
    };
  };

  const getWinnerPlayer = (gameState: GameState): Player => {
    return [...gameState].filter(([k, v]) => v.hasWon).map(([k, v]) => k)[0];
  };

  const isGameFinished = (gameState: GameState) => {
    const runningPlayers = getRunningPlayers(gameState);
    const winnerPlayer = getWinnerPlayer(gameState);
    if (winnerPlayer) {
      setWinner(winnerPlayer);
    }
    if (runningPlayers.length === 1) {
      const winnerPlayer = runningPlayers[0]!;
      const winnerPlayerState = setWinnerPlayer(gameState.get(winnerPlayer)!);
      const newGameState = new Map(gameState);
      newGameState.set(winnerPlayer, winnerPlayerState);
      setGameHistory([...gameHistory, newGameState]);
      gameHistoryRef.current = [...gameHistory, newGameState];
      setWinner(winnerPlayer);
    }
  };

  const getRunningPlayers = (gameState: GameState): Player[] => {
    return [...gameState]
      .filter(([k, v]) => !v.isEliminated)
      .map(([k, v]) => k);
  };

  const warnVlugul = (playerState: PlayerState) => {
    if (playerState.missStrike === 2) {
      Modal.warning({
        title: 'VLUGUL!',
        content: `${currentPlayer} must hit a skittle or is eliminated`,
      });
    }
  };

  const onMissedPlay = (play: Play): PlayerState => {
    const playerState = gameHistory[gameHistory.length - 1].get(play.player)!;
    const newMissStrike = playerState.missStrike + 1;
    if (newMissStrike === 3) {
      Modal.error({
        title: 'VLUGUL!',
        content: `${currentPlayer} is Out!`,
      });
    }
    return {
      ...playerState,
      missStrike: newMissStrike,
      isEliminated: newMissStrike === 3 ? true : false,
    };
  };

  const onSuccessfulPlay = (play: Play): PlayerState => {
    const playerState = gameHistory[gameHistory.length - 1].get(play.player)!;
    const newScore = playerState.totalScore + play.score;
    return {
      ...playerState,
      totalScore: newScore <= gamePoints ? newScore : gamePoints / 2,
      hasWon: newScore === gamePoints ? true : false,
      missStrike: 0,
    };
  };

  const nextTurn = (gameState: GameState) => {
    const runningPlayers = getRunningPlayers(gameState);
    const lastRunningPlayerIndex = runningPlayers.indexOf(currentPlayer);
    const nextPlayer =
      lastRunningPlayerIndex < runningPlayers.length - 1
        ? runningPlayers[lastRunningPlayerIndex + 1]
        : runningPlayers[0];
    setCurrentPlayer(nextPlayer);
  };

  const onPlayed = (score: number) => {
    const player = currentPlayer as Player;
    const play = { player, score };

    let playerState =
      score === 0
        ? onMissedPlay(play)
        : onSuccessfulPlay(play);

    const newGameState = new Map(gameHistory[gameHistory.length - 1]);
    newGameState.set(player, playerState);
    setGameHistory([...gameHistory, newGameState]);
    gameHistoryRef.current = [...gameHistory, newGameState];
  };

  const onPlayAgain = () => {
    onPlayAgainHandle();
  };

  const onUndoLast = useCallback(() => {
    if (gameHistory.length < 2) {
      return;
    }
    const lastGameState = gameHistory[gameHistory.length - 1];
    console.log(lastGameState);
    const runningPlayers = getRunningPlayers(lastGameState);
    const lastPlayerRunningIndex = runningPlayers.indexOf(currentPlayer);
    console.log(currentPlayer);
    const previousPlayer =
      lastPlayerRunningIndex > 0
        ? runningPlayers[lastPlayerRunningIndex - 1]
        : runningPlayers[runningPlayers.length - 1];
    setCurrentPlayer(previousPlayer);
    console.log(previousPlayer);

    const previousGameHistory = Array.from(gameHistory)!;
    previousGameHistory.pop();
    setGameHistory(previousGameHistory);
    gameHistoryRef.current = previousGameHistory;

    setWinner('');
  }, [gameHistory, currentPlayer]);

  return (
    <Layout className='layout' style={{ width: '100%', height: '100%' }}>
      <Content>
        <ContentWrapper>
          {!winner ? (
            <GameWrapper>
              <Title
                level={2}
                style={{ marginTop: '24px' }}
              >{`${currentPlayer} is playing...`}</Title>
              <SkittlePositions
                onClickHandle={(v: number) => onPlayed(v)}
              ></SkittlePositions>
            </GameWrapper>
          ) : (
            <ResultsWrapper>
              <Result
                status='success'
                icon={<SmileOutlined />}
                title={`${winner} has won!!!`}
                extra={
                  <Button type='primary' onClick={() => onPlayAgain()}>
                    Play again!
                  </Button>
                }
              />
            </ResultsWrapper>
          )}
          {gameHistory.length > 1 && (
            <Leaderboard
              gameState={gameHistory[gameHistory.length - 1]}
            ></Leaderboard>
          )}
          <ButtonsWrapper>
            <ButtonWrapper>
              <LastPlays plays={gameHistory.reduce((prev, state) => {
                const gameState = [...state];
                const currentPlayerState = gameState.find(([k, v]) => v.isCurrentPlayer)!;

                prev.push({
                  player: currentPlayerState[0],
                  score: currentPlayerState[1].score,
                } as never);

                return prev;
              }, [])}></LastPlays>
            </ButtonWrapper>
            <ButtonWrapper>
              <Button danger icon={<UndoOutlined />} onClick={onUndoLast}>
                Undo last
              </Button>
            </ButtonWrapper>
          </ButtonsWrapper>
        </ContentWrapper>
      </Content>
    </Layout>
  );
};

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2px;
`;

const GameWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ResultsWrapper = styled.div`
  display: flex;
`;

const ButtonsWrapper = styled.div`
  display: flex;
`;

const ButtonWrapper = styled.div`
  margin: 12px 18px;
`;
