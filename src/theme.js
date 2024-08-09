//
// Copyright 2019 DXOS.org
//

import { createTheme as createMuiTheme } from "@material-ui/core/styles";
import teal from "@material-ui/core/colors/teal";
import orange from "@material-ui/core/colors/orange";

export const createTheme = (theme) =>
  createMuiTheme({
    // https://material-ui.com/system/shadows
    shadows: ["none"],

    // https://stackoverflow.com/questions/60567673/reactjs-material-ui-theme-mixins-toolbar-offset-is-not-adapting-when-toolbar
    mixins: {
      denseToolbar: {
        height: 48,
      },
    },

    // https://material-ui.com/customization/globals/#default-props
    props: {
      MuiButtonBase: {
        disableRipple: true,
      },
      MuiButton: {
        size: "small",
      },
      MuiFilledInput: {
        margin: "dense",
      },
      MuiFormControl: {
        margin: "dense",
      },
      MuiFormHelperText: {
        margin: "dense",
      },
      MuiIconButton: {
        size: "small",
      },
      MuiInputBase: {
        margin: "dense",
      },
      MuiInputLabel: {
        margin: "dense",
      },
      MuiTable: {
        size: "small",
      },
      MuiTextField: {
        margin: "dense",
      },
      MuiToolbar: {
        variant: "dense",
      },
    },

    // https://material-ui.com/customization/palette/
    palette:
      theme === "dark"
        ? {
            type: "dark",
            primary: {
              main: "#0000F4",
            },
            secondary: {
              main: "#A2A2FF",
            },
            background: {
              default: "#0F0F0F",
              secondary: "#18181A",
              paper: "#18181A",
            },
            text: {
              primary: "#FBFBFB",
              secondary: "#BDBCC3",
              lineLabel: "#A2A2FF",
            },
          }
        : {
            primary: teal,
          },

    // https://material-ui.com/customization/theming/#theme-configuration-variables

    // https://material-ui.com/customization/globals/
    overrides: {
      MuiCssBaseline: {
        "@global": {
          body: {
            margin: 0,
            overflow: "hidden",
          },
        },
      },
    },
  });
