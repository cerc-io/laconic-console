//
// Copyright 2020 DXOS.org
//

import clsx from "clsx";
import React from "react";
import { useHistory, useParams } from "react-router";
// import { useQuery } from '@apollo/react-hooks';

import { makeStyles } from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import LinkIcon from "@material-ui/icons/ExitToApp";
import ListItemText from "@material-ui/core/ListItemText";

// import EXTENSIONS from '../gql/extensions.graphql';
// import { useQueryStatusReducer } from '../hooks';

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
  },

  list: {
    padding: 0,
  },

  listItem: {
    display: "flex",
    alignItems: "center",
    backgroundColor: theme.palette.background.default,
  },

  selected: {
    backgroundColor: theme.palette.background.secondary,
  },

  itemText: {
    fontFamily: '"DM Mono", monospace',
    fontWeight: 400,
  },

  icon: {
    minWidth: 40,
    color: theme.palette.grey[500],
  },

  selected: {
    color: theme.palette.text.primary,
  },

  expand: {
    flex: 1,
  },
}));

const Sidebar = ({ modules: { services, settings } }) => {
  const classes = useStyles();
  const history = useHistory();
  const { module } = useParams();

  // const { data: extensionsData } = useQueryStatusReducer(useQuery(EXTENSIONS));
  // const extensions = extensionsData ? JSON.parse(extensionsData.extensions.json) : [];
  const extensions = [];

  const isSelected = (path) => path === `/${module}`;

  const Modules = ({ modules }) => (
    <List aria-label="items" className={classes.list}>
      {modules.map(({ path, title, icon: Icon }) => (
        <ListItem
          button
          selected={isSelected(path)}
          key={path}
          onClick={() => history.push(path)}
          classes={{ root: classes.listItem, selected: classes.selected }}
        >
          <ListItemIcon classes={{ root: classes.icon }}>
            <Icon
              className={clsx(
                classes.icon,
                isSelected(path) && classes.selected,
              )}
            />
          </ListItemIcon>
          <ListItemText
            primary={title.toUpperCase()}
            classes={{ primary: classes.itemText }}
          />
        </ListItem>
      ))}
    </List>
  );

  const Extensions = ({ extensions }) => (
    <List aria-label="items" className={classes.list}>
      {extensions.map(({ url, title }) => {
        url = url
          .replace("%HOST%", window.location.host)
          .replace("%PORT%", window.location.port)
          .replace("%PROTOCOL%", window.location.protocol);
        return (
          <ListItem
            button
            key={url}
            onClick={() => {
              window.location = url;
              return true;
            }}
          >
            <ListItemIcon classes={{ root: classes.icon }}>
              <LinkIcon className={clsx(classes.icon)} />
            </ListItemIcon>
            <ListItemText
              primary={title.toUpperCase()}
              classes={{ primary: classes.itemText }}
            />
          </ListItem>
        );
      })}
    </List>
  );

  return (
    <div className={classes.root}>
      <Modules modules={services} />
      <Extensions extensions={extensions} />
      <div className={classes.expand} />
      <Modules modules={settings} />
    </div>
  );
};

export default Sidebar;
