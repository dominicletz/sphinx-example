import { darkBlack, grey300, white } from 'material-ui/styles/colors';
import Spacing from 'material-ui/styles/spacing';
import zIndex from 'material-ui/styles/zIndex';
import { fade } from 'material-ui/utils/colorManipulator';

var themeColors = {
  primary: '#00bcd6',
  secondary: '#ff3b80',
  exoNavy: '#222736',
  exoGray: '#5C5D60',

  exoMediumBlue: '#2C9DB6',
  exoLightGray: '#E5E5E5',
  exoOrange: '#FF921E'
};

export default {
  spacing: Spacing,
  zIndex: zIndex,
  fontFamily: 'Roboto, sans-serif',
  palette: {
    primary1Color: themeColors.primary,
    primary2Color: fade(themeColors.primary, 0.8),
    primary3Color: themeColors.exoGray,
    accent1Color: themeColors.secondary,
    accent2Color: fade(themeColors.secondary, 0.3),
    accent3Color: themeColors.exoLightGray,
    textColor: darkBlack,
    alternateTextColor: white,
    canvasColor: white,
    borderColor: grey300,
    disabledColor: fade(darkBlack, 0.3),
    pickerHeaderColor: themeColors.primary,
  },
  appBar: {
    color: '#fff',
  },
  button: {
    minWidth: 66,
  },
};
