//
// Copyright 2020 DXOS.org
//

import React from "react";
import { makeStyles } from "@material-ui/core";

import { JsonTreeView } from "@lirewine/react-ux";

import { omitDeep } from "../util/omit";

const useStyles = makeStyles(() => ({
  root: {
    flex: 1,
  },
}));
const useTreeStyles = makeStyles(
  (theme) => ({
    colorPrimary: {
      color: theme.palette.secondary.main,
    },
  }),
  { name: "MuiTypography" },
);

const Json = ({ data }) => {
  const classes = useStyles();
  useTreeStyles();

  return (
    <JsonTreeView
      className={classes.root}
      data={omitDeep(data, "__typename")}
    />
  );
};

export default Json;
