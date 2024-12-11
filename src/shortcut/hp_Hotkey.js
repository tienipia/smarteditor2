import { Shortcut } from './shortcut';

export const Hotkey = jindo.$Class({
  name: 'Hotkey',

  $ON_ADD_HOTKEY: function (sHotkey, sCMD, aArgs, elTarget) {
    if (!aArgs) {
      aArgs = [];
    }

    var func = jindo.$Fn(this.oApp.exec, this.oApp).bind(sCMD, aArgs);
    new Shortcut(sHotkey, elTarget).addEvent(func);
  }
});
