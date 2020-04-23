import styled from '@emotion/styled';
import { Layout, Result, Button, Modal } from 'antd';
import Title from 'antd/lib/typography/Title';
import React, { useState, useEffect } from 'react';
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
  const [plays, setPlays] = useState<Play[]>([]);
  const [gameHistory, setGameHistory] = useState<GameState[]>([]);
  const [showResults, setShowresults] = useState(false);

  useEffect(() => {
    let initialGameStep = new Map<Player, PlayerState>();
    players.map((player) =>
      initialGameStep.set(player, {
        totalScore: 0,
        missStrike: 0,
        isEliminated: false,
        hasWon: false,
      })
    );
    setGameHistory([initialGameStep]);
  }, [players]);

  const setWinnerPlayer = (playerState: PlayerState) => {
    return {
      ...playerState,
      hasWon: true,
    };
  };

  const getWinnerPlayer = (): Player => {
    const previousGameState = gameHistory[gameHistory.length - 1];
    return [...previousGameState]
      .filter(([k, v]) => v.hasWon)
      .map(([k, v]) => k)[0];
  };

  const getRunningPlayers = (): Player[] => {
    const previousGameState = gameHistory[gameHistory.length - 1];
    return [...previousGameState]
      .filter(([k, v]) => !v.isEliminated)
      .map(([k, v]) => k);
  };

  const hasPlayerWon = (playerState: PlayerState) => {
    if (playerState.hasWon) {
      setShowresults(true);
    }
  };

  const hasPlayerLost = (playerState: PlayerState) => {
    if (playerState.isEliminated) {
      Modal.error({
        title: 'VLUGUL!',
        content: `${currentPlayer} is Out!`,
      });
    }
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

  const nextTurn = () => {
    const previousGameState = gameHistory[gameHistory.length - 1];
    const runningPlayers = getRunningPlayers();

    if (runningPlayers.length === 1) {
      const winningPlayer = runningPlayers[0]!;
      const winningPlayerState = setWinnerPlayer(
        previousGameState.get(winningPlayer)!
      );
      const newGameState = new Map(previousGameState);
      newGameState.set(winningPlayer, winningPlayerState);
      setGameHistory([...gameHistory, newGameState]);
      setShowresults(true);
    }
    const lastRunningPlayerIndex = runningPlayers.indexOf(currentPlayer);
    const nextPlayer =
      lastRunningPlayerIndex < runningPlayers.length - 1
        ? runningPlayers[lastRunningPlayerIndex + 1]
        : runningPlayers[0];
    setCurrentPlayer(nextPlayer);
    warnVlugul(previousGameState.get(nextPlayer)!);
  };

  const onPlayed = (score: number) => {
    const player = currentPlayer as Player;
    const play = { player, score };
    setPlays([...plays, play]);

    let playerState: PlayerState;
    score === 0
      ? (playerState = onMissedPlay(play))
      : (playerState = onSuccessfulPlay(play));

    const newGameState = new Map(gameHistory[gameHistory.length - 1]);
    newGameState.set(player, playerState);
    setGameHistory([...gameHistory, newGameState]);

    hasPlayerWon(playerState);
    hasPlayerLost(playerState);
    nextTurn();
  };

  const onPlayAgain = () => {
    setPlays([]);
    onPlayAgainHandle();
  };

  const getLastGameState = (): GameState => {
    return gameHistory[gameHistory.length - 1];
  };

  const onUndoLast = () => {
    if (gameHistory.length < 2) {
      return;
    }
    const runningPlayers = getRunningPlayers();
    const lastRunningPlayerIndex = runningPlayers.indexOf(currentPlayer);
    const previousPlayer =
      lastRunningPlayerIndex > 0
        ? runningPlayers[lastRunningPlayerIndex - 1]
        : runningPlayers[runningPlayers.length - 1];
    setCurrentPlayer(previousPlayer);

    const previousGameHistory = Array.from(gameHistory)!;
    previousGameHistory.pop();
    setGameHistory(previousGameHistory);

    const previousPlays = Array.from(plays)!;
    previousPlays.pop();
    setPlays(previousPlays);

    setShowresults(false);
    warnVlugul(
      previousGameHistory[previousGameHistory.length - 1].get(previousPlayer)!
    );
  };

  return (
    <Layout className='layout' style={{ width: '100%', height: '100%' }}>
      <Content>
        <ContentWrapper>
          {!showResults ? (
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
                title={`${getWinnerPlayer()} has won!!!`}
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
              <LastPlays plays={plays}></LastPlays>
            </ButtonWrapper>
            <ButtonWrapper>
              <Button
                danger
                icon={<UndoOutlined />}
                onClick={() => onUndoLast()}
              >
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
