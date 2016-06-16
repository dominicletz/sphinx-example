import Colors from 'material-ui/lib/styles/colors';
import ColorManipulator from 'material-ui/lib/utils/color-manipulator';
import Spacing from 'material-ui/lib/styles/spacing';
import zIndex from 'material-ui/lib/styles/zIndex';

var ExositeColors = {
  exoBlue: '#41C4DC',
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
    primary1Color: '#ffffff',
    primary2Color: ExositeColors.exoBlue,
    primary3Color: ExositeColors.exoGray,
    accent1Color: ExositeColors.exoOrange,
    accent2Color: ExositeColors.exoMediumBlue,
    accent3Color: ExositeColors.exoLightGray,
    textColor: Colors.darkBlack,
    alternateTextColor: Colors.white,
    canvasColor: Colors.white,
    borderColor: Colors.grey300,
    disabledColor: ColorManipulator.fade(Colors.darkBlack, 0.3),
    pickerHeaderColor: ExositeColors.exoBlue,
  }
};