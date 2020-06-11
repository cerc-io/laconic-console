//
// Copyright 2020 DxOS.org
//

import compareVersions from 'compare-versions';
import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { makeStyles } from '@material-ui/core';

import SYSTEM_STATUS from '../gql/system_status.graphql';
import WNS_RECORDS from '../gql/wns_records.graphql';

import { useQueryStatusReducer } from '../hooks';

const CHECK_INTERVAL = 5 * 60 * 1000;

const useStyles = makeStyles(theme => ({
  update: {
    color: theme.palette.error.light
  }
}));

/**
 * Checks for a system upgrade.
 */
const VersionCheck = () => {
  const classes = useStyles();
  const [{ current, latest }, setUpgrade] = useState({});
  const statusRespone = useQueryStatusReducer(useQuery(SYSTEM_STATUS));
  const wnsResponse = useQueryStatusReducer(useQuery(WNS_RECORDS, {
    pollInterval: CHECK_INTERVAL,
    variables: { attributes: { type: 'wrn:resource' } }
  }));

  // Check version.
  useEffect(() => {
    if (statusRespone && wnsResponse) {
      const statusData = JSON.parse(statusRespone.system_status.json);
      const wnsData = JSON.parse(wnsResponse.wns_records.json);

      const { dxos: { image: current = '0.0.0' } = {} } = statusData;

      let latest = current;
      wnsData.forEach(({ attributes: { name, version } }) => {
        // TODO(burdon): Filter by type (WRN?)
        if (name.startsWith('dxos/xbox:')) {
          if (compareVersions(version, latest) > 0) {
            latest = version;
          }
        }
      });

      setUpgrade({ current, latest: latest !== current ? latest : undefined });
    }
  }, [status, wnsResponse]);

  // TODO(burdon): Link to Github page with upgrade info.
  return (
    <>
      {current && (
        <div>SYS: {current}</div>
      )}
      {latest && (
        <div className={classes.update}>LATEST: {latest}</div>
      )}
    </>
  );
};

export default VersionCheck;