//
// Copyright 2020 DxOS
//

import React, { useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';

import Json from '../components/Json';

import { ConsoleContext, useQueryStatusReducer } from '../hooks';

import QUERY from '../../gql/status.graphql';

const Status = () => {
  const { config } = useContext(ConsoleContext);
  const data = useQueryStatusReducer(useQuery(QUERY, { pollInterval: config.api.pollInterval }));
  if (!data) {
    return null;
  }

  return (
    <Json data={data} />
  );
};

export default Status;
