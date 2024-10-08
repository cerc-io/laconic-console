//
// Copyright 2020 DXOS.org
//

import React, { useState } from "react";
import { makeStyles } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import TabContext from "@material-ui/lab/TabContext";

import Panel from "../../../components/Panel";
import Toolbar from "../../../components/Toolbar";
// import LogPoller from '../../../components/LogPoller';

import RegistryLookup, { LookupType } from "./RegistryLookup";
import RegistryStatus from "./RegistryStatus";
import RegistryRecords from "./RegistryRecords";
// import RegistryRecords, { RecordType } from './RegistryRecords';

const TAB_RECORDS = "records";
const TAB_STATUS = "status";
const TAB_LOOKUP = "lookup";
// const TAB_LOG = 'log';

const useStyles = makeStyles(() => ({
  expand: {
    flex: 1,
  },

  panel: {
    display: "flex",
    overflowY: "scroll",
    flex: 1,
  },

  paper: {
    display: "flex",
    overflow: "hidden",
    flex: 1,
  },

  tabs: {
    fontFamily: '"DM Mono", monospace',
    fontWeight: 400,
  },
}));

const Registry = () => {
  const classes = useStyles();
  const [tab, setTab] = useState(TAB_RECORDS);
  const [scope, setScope] = useState(LookupType.default);
  // const [type, setType] = useState();

  return (
    <Panel
      toolbar={
        <Toolbar>
          <Tabs
            value={tab}
            onChange={(_, value) => setTab(value)}
            indicatorColor="primary"
          >
            <Tab value={TAB_RECORDS} label="Records" className={classes.tabs} />
            <Tab value={TAB_LOOKUP} label="Lookup" className={classes.tabs} />
            <Tab value={TAB_STATUS} label="Status" className={classes.tabs} />
            {/* <Tab value={TAB_LOG} label='Log' /> */}
          </Tabs>

          {/* {tab === TAB_RECORDS && (
            <RecordType type={type} onChange={setType} />
          )} */}
          {tab === TAB_LOOKUP && (
            <LookupType scope={scope} onChange={setScope} />
          )}
        </Toolbar>
      }
    >
      <TabContext value={tab}>
        {tab === TAB_RECORDS && (
          <div className={classes.panel}>
            {/* <RegistryRecords type={type} /> */}
            <RegistryRecords />
          </div>
        )}

        {tab === TAB_LOOKUP && (
          <div className={classes.panel}>
            <RegistryLookup scope={scope} />
          </div>
        )}

        {tab === TAB_STATUS && (
          <div className={classes.panel}>
            <Paper className={classes.paper}>
              <RegistryStatus />
            </Paper>
          </div>
        )}

        {/* {tab === TAB_LOG && (
          <div className={classes.panel}>
            <LogPoller service='wns-lite' />
          </div>
        )} */}
      </TabContext>
    </Panel>
  );
};

export default Registry;
