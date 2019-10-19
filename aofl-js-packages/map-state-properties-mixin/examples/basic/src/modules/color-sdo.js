import {storeInstance, Sdo, state} from '@aofl/store';

class ColorSdo extends Sdo {
  static namespace = 'color';

  @state() color = 'gold';
}

const colorSdo = new ColorSdo();
storeInstance.addState(colorSdo);

export {colorSdo};
