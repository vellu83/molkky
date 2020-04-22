import { Table } from 'antd';
import React from 'react';
import { PlayerState } from '../game/GameInProgress';
import styled from '@emotion/styled';

type Props = {
  scores: PlayerState[];
};

export const Leaderboard = ({ scores }: Props) => {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Score',
      dataIndex: 'score',
      sorter: {
        compare: (a: any, b: any) => b.score - a.score,
        multiple: 3,
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
      title: 'Eliminated',
      dataIndex: 'isEliminated',
    },
  ];

  const data = scores.map((s) => ({
    name: s.player.name,
    score: s.totalScore,
    missStrike: s.missStrike,
    isEliminated: s.isEliminated ? 'X' : '',
  }));

  function onChange(pagination: any, filters: any, sorter: any, extra: any) {
    console.log('params', pagination, filters, sorter, extra);
  }
  return (
    <TableWrapper>
      <Table
        columns={columns}
        pagination={false}
        dataSource={data}
        rowKey='name'
        onChange={onChange}
      />
    </TableWrapper>
  );
};

const TableWrapper = styled.div`
  margin: 16px 4px;
`;
