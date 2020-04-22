import styled from '@emotion/styled';
import { Layout, Result, Button, Modal } from 'antd';
import Title from 'antd/lib/typography/Title';
import React, { useState } from 'react';
import { LastPlays } from '../shared/LastPlays';
import { Leaderboard } from '../shared/Leaderboard';
import { SkittlePositions } from '../shared/SkittlePositions';
import { Player } from './GamePage';
import { SmileOutlined, UndoOutlined } from '@ant-design/icons';

const { Content } = Layout;

const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * Math.floor(max));
};

export type Play = {
  player: Player;
  score: number;
};

export type PlayerState = {
  player: Player;
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
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(
    getRandomInt(players.length)
  );
  const [currentPlayer, setCurrentPlayer] = useState<Player>(
    players[currentPlayerIndex]
  );
  const [plays, setPlays] = useState<Play[]>([]);
  const [playerStates, setPlayerStates] = useState<PlayerState[]>([
    ...players.map((player) => ({
      player,
      totalScore: 0,
      missStrike: 0,
      isEliminated: false,
      hasWon: false,
    })),
  ]);
  const [currentPlayerState, setCurrentPlayerState] = useState<PlayerState>(
    playerStates.find((ps) => ps.player === currentPlayer)!
  );
  const [showResults, setShowresults] = useState(false);

  const getRunningPlayers = () => {
    return playerStates.filter((ps) => !ps.isEliminated).map((ps) => ps.player);
  };

  const nextTurn = () => {
    const runningPlayers = getRunningPlayers();
    const previousPlayerIndex = runningPlayers.indexOf(currentPlayer);
    const nextPlayer =
      runningPlayers[
        previousPlayerIndex < runningPlayers.length - 1
          ? previousPlayerIndex + 1
          : 0
      ];
    const nextPlayerIndex = playerStates
      .map((ps) => ps.player)
      .indexOf(nextPlayer);
    const nexPlayerState = playerStates.find((ps) => ps.player === nextPlayer)!;
    setCurrentPlayer(nextPlayer);
    setCurrentPlayerIndex(nextPlayerIndex);
    setCurrentPlayerState(nexPlayerState);
    mightBeVlugul(nextPlayer);
  };

  const onMissedPlay = () => {
    const playerState = currentPlayerState!;
    playerState.missStrike++;
    if (playerState.missStrike === 3) {
      playerState.isEliminated = true;
      playerIsEliminated();
      return playerState;
    }
    return playerState;
  };

  const onSuccessfulPlay = (value: number) => {
    const playerState = currentPlayerState;
    const newPlayerGameScore = playerState.totalScore + value;
    playerState.missStrike = 0;
    newPlayerGameScore <= gamePoints
      ? (playerState.totalScore = newPlayerGameScore)
      : (playerState.totalScore = gamePoints / 2);
    if (newPlayerGameScore === gamePoints) {
      playerState.hasWon = true;
      return playerState;
    }
    return playerState;
  };

  const playerHasWon = () => {
    setShowresults(true);
  };

  const onPlayed = (value: number) => {
    setPlays([...plays, { player: currentPlayer, score: value }]);
    let newPlayerState: PlayerState;
    value === 0
      ? (newPlayerState = onMissedPlay())
      : (newPlayerState = onSuccessfulPlay(value));
    const newPlayerStates = [
      ...playerStates.slice(0, currentPlayerIndex),
      newPlayerState,
      ...playerStates.slice(currentPlayerIndex + 1, playerStates.length),
    ];
    setCurrentPlayerState(newPlayerState);
    setPlayerStates(newPlayerStates);
    currentPlayerState!.hasWon ||
    playerStates.filter((ps) => !ps.isEliminated).length === 1
      ? playerHasWon()
      : nextTurn();
  };

  const mightBeVlugul = (player: Player) => {
    if (playerStates.find((ps) => ps.player === player)?.missStrike === 2) {
      Modal.warning({
        title: 'VLUGUL!',
        content: 'the player must hit a skittle or is eliminated',
      });
    }
  };

  const playerIsEliminated = () => {
    const playerState = currentPlayerState!;
    playerState.isEliminated = true;
    Modal.error({
      title: 'VLUGUL!',
      content: `${playerState.player.name} is eliminated`,
    });
  };

  const onPlayAgain = () => {
    setPlays([]);
    onPlayAgainHandle();
  };

  const onUndoLast = () => {
    if (plays.length === 0) {
      return;
    }
    let previousPlays = plays;
    const lastPlay = previousPlays.pop();
    setPlays(previousPlays);

    const lastPlayer = lastPlay!.player;
    const lastPlayerState = playerStates.find(
      (ps) => ps.player === lastPlayer
    )!;
    const lastPlayerIndex = players.indexOf(lastPlayer);
    const lastScore = lastPlay!.score;
    const lastPlayerPreviousState = {
      player: lastPlayer,
      totalScore: lastPlayerState.totalScore - lastScore,
      isEliminated: false,
      hasWon: false,
      missStrike:
        lastPlay?.score === 0
          ? lastPlayerState.missStrike - 1
          : lastPlayerState.missStrike,
    };

    const previousPlayerStates = [
      ...playerStates.filter((ps) => ps.player !== lastPlayer),
      lastPlayerPreviousState,
    ];
    setCurrentPlayer(lastPlayer);
    setCurrentPlayerIndex(lastPlayerIndex);
    setCurrentPlayerState(lastPlayerPreviousState);
    setPlayerStates(previousPlayerStates);
    setShowresults(false);
    mightBeVlugul(lastPlayer);
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
              >{`${currentPlayer.name} is playing...`}</Title>
              <SkittlePositions
                onClickHandle={(v: number) => onPlayed(v)}
              ></SkittlePositions>
            </GameWrapper>
          ) : (
            <ResultsWrapper>
              <Result
                status='success'
                icon={<SmileOutlined />}
                title={`${
                  currentPlayerState!.hasWon
                    ? currentPlayer.name
                    : playerStates.find((ps) => !ps.isEliminated)?.player.name
                } has won!!!`}
                extra={
                  <Button type='primary' onClick={() => onPlayAgain()}>
                    Play again!
                  </Button>
                }
              />
            </ResultsWrapper>
          )}
          <Leaderboard playerStates={playerStates}></Leaderboard>
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
