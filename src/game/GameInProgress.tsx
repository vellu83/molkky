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
  const [showResults, setShowresults] = useState(false);
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

  const getRunningPlayers = () => {
    return playerStates.filter((ps) => !ps.isEliminated).map((ps) => ps.player);
  };

  const toNextTurn = () => {
    const runningPlayers = getRunningPlayers();
    if (playerStates.find((p) => p.hasWon) || runningPlayers.length === 1) {
      setShowresults(true);
      return;
    }
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
    setCurrentPlayer(nextPlayer);
    setCurrentPlayerIndex(nextPlayerIndex);
    mightBeVlugul(nextPlayer);
  };

  const onMissedPlay = () => {
    const playerState = playerStates[currentPlayerIndex];
    if (playerState.missStrike === 2) {
      playerState.isEliminated = true;
      isVlugul(playerState);
      return playerState;
    }
    playerState.missStrike++;
    return playerState;
  };

  const onSuccessfulPlay = (value: number) => {
    const playerState = playerStates[currentPlayerIndex];
    const newPlayerGameScore = playerState.totalScore + value;
    playerState.missStrike = 0;
    newPlayerGameScore <= gamePoints
      ? (playerState.totalScore = newPlayerGameScore)
      : (playerState.totalScore = gamePoints / 2);
    if (newPlayerGameScore === gamePoints) {
      playerState.hasWon = true;
    }
    return playerState;
  };

  const onPlayed = (value: number) => {
    setPlays([...plays, { player: currentPlayer, score: value }]);
    let newPlayerState: PlayerState;
    if (value === 0) {
      newPlayerState = onMissedPlay();
    } else {
      newPlayerState = onSuccessfulPlay(value);
    }
    const newPayerStates = [
      ...playerStates.slice(0, currentPlayerIndex),
      newPlayerState,
      ...playerStates.slice(currentPlayerIndex + 1, playerStates.length),
    ];
    setPlayerStates(newPayerStates);
    toNextTurn();
  };

  const mightBeVlugul = (player: Player) => {
    if (playerStates.find((ps) => ps.player === player)?.missStrike === 2) {
      Modal.warning({
        title: 'VLUGUL!',
        content: 'the player must hit a skittle or is eliminated',
      });
    }
  };

  const isVlugul = (ps: PlayerState) => {
    Modal.error({
      title: 'VLUGUL!',
      content: `${ps.player.name} is eliminated`,
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
    const lastPlayer = previousPlays[previousPlays.length - 1].player;
    const lastPlayerState = playerStates.find(
      (ps) => ps.player === lastPlayer
    )!;
    const lastScore = previousPlays[previousPlays.length - 1].score;
    previousPlays.pop();
    setPlays(previousPlays);
    const previousPlayer = previousPlays[previousPlays.length - 1].player;
    const previousPlayerIndex = players.indexOf(previousPlayer);
    const previousPlayerStates = [
      ...playerStates.filter((ps) => ps.player !== lastPlayer),
      {
        ...lastPlayerState,
        totalScore: lastPlayerState.totalScore - lastScore,
        isEliminated: false,
      },
    ];
    setCurrentPlayer(lastPlayer);
    setCurrentPlayerIndex(previousPlayerIndex);
    setPlayerStates(previousPlayerStates);
    setShowresults(false);
  };

  return (
    <Layout className='layout' style={{ width: '100%', height: '100%' }}>
      <Content>
        <ContentWrapper>
          <Title>Playing</Title>
          {!showResults ? (
            <GameWrapper>
              <Title level={2}>{`${currentPlayer.name} is playing...`}</Title>
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
                  playerStates.find((ps) => !ps.isEliminated)?.player.name
                } has won!!!`}
                extra={
                  <Button type='primary' onClick={() => onPlayAgain()}>
                    Play again!
                  </Button>
                }
              />
            </ResultsWrapper>
          )}
          <Leaderboard scores={playerStates}></Leaderboard>
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
