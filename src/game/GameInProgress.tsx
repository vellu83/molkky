import {
  AudioOutlined,
  DownOutlined,
  SmileOutlined,
  UndoOutlined,
} from '@ant-design/icons';
import styled from '@emotion/styled';
import {
  Button,
  Dropdown,
  Layout,
  Menu,
  Modal,
  notification,
  Result,
} from 'antd';
import Title from 'antd/lib/typography/Title';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSpeechRecognition } from 'react-speech-kit';
import { useStickyState } from '../shared/hook';
import { LastPlays } from '../shared/LastPlays';
import { Leaderboard } from '../shared/Leaderboard';
import { SkittlePositions } from '../shared/SkittlePositions';
import { Player } from './GamePage';
const writtenNumber = require('written-number');

const { Content } = Layout;

const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * Math.floor(max));
};

export type GameState = Map<Player, PlayerState>;

type PlayerState = {
  totalScore: number;
  missStreak: number;
  score: number;
  isCurrentPlayer: boolean;
  isEliminated: Boolean;
  hasWon: Boolean;
};

type Props = {
  gamePoints: number;
  players: Player[];
  onNewGameHandle: Function;
  pullo:string
};

export const GameInProgress = ({
  gamePoints,
  players,
  onNewGameHandle,
  pullo
}: Props) => {
  const [currentPlayer, setCurrentPlayer] = useStickyState(
    players[getRandomInt(players.length)] as Player,
    'tämän hetkinen pelaaja'
  );
  const [gameHistory, setGameHistory] = useStickyState(
    [] as GameState[],
    'peli-historia'
  );
  const gameHistoryRef = useRef(gameHistory);
  const [winner, setWinner] = useStickyState('' as Player, 'winner');
  const [isMicAuthorized, setMicAuthorized] = useState(false);
  const outcomes: string[] = [
    ...Array.from({ length: 12 }, (x, i) => `${i}`),
    ...Array.from({ length: 12 }, (x, i) => writtenNumber(i, { lang: 'fr' })),
    ...Array.from({ length: 12 }, (x, i) => writtenNumber(i, { lang: 'es' })),
  ];

  const { listen, listening, stop } = useSpeechRecognition({
    onResult: (result: string) => {
      const resultIndex = outcomes.indexOf(result.toLowerCase());
      if (resultIndex !== -1) {
        const detectedValue = +outcomes[mod(resultIndex, 12)];
        onClick(detectedValue);
        notification.success({ message: `${detectedValue} detected` });
      } else {
        notification.error({ message: `Invalid: ${result} detected` });
      }
    },
  });

  const requestMicPermission = async () => {
    if (!isMicAuthorized) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then(() => setMicAuthorized(true))
        .catch(() =>
          notification.error({ message: 'ei voi käyttää mikrofonia' })
        );
    }
  };

  useEffect(() => {
    if (window.localStorage.getItem('peli-historia')?.length! > 2) {
      return;
    }

    const initialGameHistory = getInitialGameHistory();
    setGameHistory(initialGameHistory);
  }, [players]);

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
    const gameState: GameState = gameHistory[gameHistory.length - 1];
    if (!gameState || isGameFinished(gameState)) {
      return;
    }
    const previousGameState: GameState = gameHistory[gameHistory.length - 2];
    if (
      previousGameState &&
      previousGameState.get(currentPlayer)?.missStreak ===
        gameState.get(currentPlayer)?.missStreak &&
      previousGameState.get(currentPlayer)?.totalScore ===
        gameState.get(currentPlayer)?.totalScore
    ) {
      return;
    }
    nextTurn(gameState);
  }, [gameHistory]);

  const mod = (n: number, m: number): number => {
    return ((n % m) + m) % m;
  };

  const getInitialGameHistory = (): GameState[] => {
    const initialGameState = new Map<Player, PlayerState>();
    players.forEach((player) =>
      initialGameState.set(player, {
        totalScore: 0,
        score: 0,
        missStreak: 0,
        isCurrentPlayer: player === currentPlayer,
        isEliminated: false,
        hasWon: false,
      })
    );
    return [initialGameState];
  };

  const getWinnerPlayer = (gameState: GameState): Player => {
    return [...gameState].filter(([k, v]) => v.hasWon).map(([k, v]) => k)[0];
  };

  const isGameFinished = (gameState: GameState): Boolean => {
    const runningPlayers = getRunningPlayers(gameState);
    const winnerPlayer = getWinnerPlayer(gameState);
    if (winnerPlayer) {
      setWinner(winnerPlayer);
      return true;
    }
    if (runningPlayers.length === 1) {
      const winnerPlayer = runningPlayers[0]!;
      setWinner(winnerPlayer);
      return true;
    }
    return false;
  };

  const getRunningPlayers = (gameState: GameState): Player[] => {
    return [...gameState]
      .filter(([k, v]) => !v.isEliminated)
      .map(([k, v]) => k);
  };

  const warnVlugul = (playerState: PlayerState) => {
    if (playerState.missStreak === 2) {
      Modal.warning({
        title: 'VLUGUL!',
        content: `${currentPlayer} sinun on osuttava tai tiput`,
      });
    }
  };

  const onPlay = (gameState: GameState, score: number): PlayerState => {
    const playerState = gameState.get(currentPlayer)!;
    const newScore = playerState.totalScore + score;
    const newMissStreak = score === 0 ? playerState.missStreak + 1 : 0;
    if (newMissStreak === 3) {
      Modal.error({
        title: 'VLUGUL!',
        content: `${currentPlayer} tippui pois :( )`,
      });
    }
    return {
      ...playerState,
      totalScore: newScore <= gamePoints ? newScore : gamePoints / 2,
      score,
      hasWon: newScore === gamePoints,
      isEliminated: newMissStreak === 3,
      missStreak: newMissStreak,
      isCurrentPlayer: true,
    };
  };

  const nextTurn = (gameState: GameState) => {
    const playerIndex = players.indexOf(currentPlayer);
    let nextPlayerIndex;
    let i = 0;
    do {
      nextPlayerIndex = mod(playerIndex + i + 1, players.length);
      i++;
    } while (gameState.get(players[nextPlayerIndex])?.isEliminated);

    const nextPlayer = players[nextPlayerIndex];
    setCurrentPlayer(nextPlayer);
  };

  const onClick = (score: number) => {
    const player = currentPlayer as Player;
    const gameState = gameHistory[gameHistory.length - 1];

    let playerState = onPlay(gameState, score);

    const newGameState = new Map(gameState);
    [...newGameState].forEach(([player, state]) =>
      newGameState.set(player, { ...(state as {}), isCurrentPlayer: false })
    );
    newGameState.set(player, playerState);
    setGameHistory([...gameHistory, newGameState]);
    gameHistoryRef.current = [...gameHistory, newGameState];
  };

  const onUndoLast = useCallback(() => {
    if (gameHistory.length < 2) {
      return;
    }

    setWinner('');
    const previousGameHistory = Array.from(gameHistory)! as GameState[];
    previousGameHistory.pop();
    const previousPlayer = [
      ...previousGameHistory[previousGameHistory.length - 1],
    ]
      .filter(([k, v]) => v.isCurrentPlayer)
      .map(([k, v]) => k)[0];
    setCurrentPlayer(previousPlayer);
    setGameHistory(previousGameHistory);
    gameHistoryRef.current = previousGameHistory;
  }, [gameHistory]);

  const onPlayAgain = useCallback(() => {
    setCurrentPlayer(players[getRandomInt(players.length)]);
    const initialGameHistory = getInitialGameHistory();
    setGameHistory(initialGameHistory);
    gameHistoryRef.current = [];
    setWinner('');
  }, []);

  const restartMenu = (
    <Menu
      onClick={({ key }) => {
        key === 'restart' ? onPlayAgain() : onNewGameHandle();
      }}
    >
      <Menu.Item key='restart'>Play again</Menu.Item>
      <Menu.Item key='new'>New game</Menu.Item>
    </Menu>
  );

  return (
    <Layout className='layout' style={{ width: '100%', height: '100%' }}>
      <Content>
        <ContentWrapper>
          {!winner ? (
            <GameWrapper>
              <StyledTitle
                level={2}
              >{`${currentPlayer} is playing...`}</StyledTitle>
              <SkittlePositions
                onClickHandle={(v: number) => onClick(v)}
                pullo={pullo}
              ></SkittlePositions>
              <StyledButton
                shape='circle'
                size='large'
                icon={<AudioOutlined />}
                onMouseDown={listen}
                onMouseUp={stop}
                onClick={() => {
                  requestMicPermission();
                }}
              ></StyledButton>
            </GameWrapper>
          ) : (
            <ResultsWrapper>
              <Result
                status='success'
                icon={<SmileOutlined />}
                title={`${winner} has won!!!`}
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
              <LastPlays
                plays={gameHistory.reduce(
                  (prev: any, state: any, idx: number) => {
                    if (idx === 0) {
                      return prev;
                    }
                    const gameState = [...state];
                    const currentPlayerState = gameState.find(
                      ([k, v]) => v.isCurrentPlayer
                    )!;

                    prev.push({
                      player: currentPlayerState[0],
                      score: currentPlayerState[1].score,
                    } as never);

                    return prev;
                  },
                  []
                )}
              ></LastPlays>
            </ButtonWrapper>
            <StyledButton danger icon={<UndoOutlined />} onClick={onUndoLast}>
              Undo
            </StyledButton>
            <StyledDropdown overlay={restartMenu}>
              <Button>
                Restart <DownOutlined />
              </Button>
            </StyledDropdown>
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
  align-items: center;
`;

const ButtonWrapper = styled.div`
  margin: 12px 18px;
`;
const StyledButton = styled(Button)`
  margin: 8px 12px;
`;

const StyledDropdown = styled(Dropdown)`
  margin: 8px 12px;
`;

const StyledTitle = styled(Title)`
  margin-top: 24px;
`;
