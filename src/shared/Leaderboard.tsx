import styled from '@emotion/styled';
import { Table } from 'antd';
import React from 'react';
import { GameState } from '../game/GameInProgress';

type Props = {
  gameState: GameState;
};

export const Leaderboard = ({ gameState }: Props) => {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      multiple: 1,
    },
    {
      title: 'Score',
      dataIndex: 'score',
      sorter: {
        compare: (a: any, b: any) => b.score - a.score,
        multiple: 2,
      },
    },
    {
      title: 'Misses',
      dataIndex: 'missStrike',
      sorter: {
        compare: (a: any, b: any) => b.missStrike - a.missStrike,
        multiple: 3,
      },
    },
    {
      title: 'Out',
      dataIndex: 'isEliminated',
      multiple: 4,
    },
  ];

  const data = [...gameState].map(([player, state]) => ({
    name: player,
    score: state.totalScore,
    missStrike: state.missStrike,
    isEliminated: state.isEliminated ? 'X' : '',
  }));

  return (
    <TableWrapper>
      <Table
        columns={columns}
        pagination={false}
        dataSource={data}
        rowKey='name'
      />
    </TableWrapper>
  );
};

const TableWrapper = styled.div`
  margin: 6px 2px;
`;
