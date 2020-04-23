import styled from '@emotion/styled';
import { Table } from 'antd';
import React from 'react';
import { PlayerState } from '../game/GameInProgress';

type Props = {
  playerStates: PlayerState[];
};

export const Leaderboard = ({ playerStates }: Props) => {
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

  const data = playerStates.map((ps) => ({
    name: ps.player.name,
    score: ps.totalScore,
    missStrike: ps.missStrike,
    isEliminated: ps.isEliminated ? 'X' : '',
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
