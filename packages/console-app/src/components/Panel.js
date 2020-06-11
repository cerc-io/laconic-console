//
// Copyright 2020 DxOS.org
//

import React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflow: 'hidden'
  },

  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflowY: 'scroll'
  }
}));

const Panel = ({ toolbar, children }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {toolbar}
      <div className={classes.container}>
        {children}
      </div>
    </div>
  );
};

export default Panel;