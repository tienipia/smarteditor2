import { HuskyCore } from '../husky_framework';
import { DialogLayerManager, DraggableLayer } from './index';

HuskyCore.addLoadedFile('hp_DialogLayerManager$Lazy.js');
/**
 * @depends DialogLayerManager
 * this.oApp.registerLazyMessage(["SHOW_DIALOG_LAYER","TOGGLE_DIALOG_LAYER"], ["hp_DialogLayerManager$Lazy.js", "N_DraggableLayer.js"]);
 */
HuskyCore.mixin(DialogLayerManager, {
  //@lazyload_js SHOW_DIALOG_LAYER,TOGGLE_DIALOG_LAYER:N_DraggableLayer.js[
  $ON_SHOW_DIALOG_LAYER: function (elLayer, htOptions) {
    elLayer = jindo.$(elLayer);
    htOptions = htOptions || {};

    if (!elLayer) {
      return;
    }

    if (jindo.$A(this.aOpenedLayers).has(elLayer)) {
      return;
    }

    this.oApp.exec('POSITION_DIALOG_LAYER', [elLayer]);

    this.aOpenedLayers[this.aOpenedLayers.length] = elLayer;

    var oDraggableLayer;
    var nIdx = jindo.$A(this.aMadeDraggable).indexOf(elLayer);

    if (nIdx == -1) {
      oDraggableLayer = new DraggableLayer(elLayer, htOptions);
      this.aMadeDraggable[this.aMadeDraggable.length] = elLayer;
      this.aDraggableLayer[this.aDraggableLayer.length] = oDraggableLayer;
    } else {
      if (htOptions) {
        oDraggableLayer = this.aDraggableLayer[nIdx];
        oDraggableLayer.setOptions(htOptions);
      }
      elLayer.style.display = 'block';
    }

    if (htOptions.sOnShowMsg) {
      this.oApp.exec(htOptions.sOnShowMsg, htOptions.sOnShowParam);
    }
  },

  $ON_HIDE_LAST_DIALOG_LAYER: function () {
    this.oApp.exec('HIDE_DIALOG_LAYER', [this.aOpenedLayers[this.aOpenedLayers.length - 1]]);
  },

  $ON_HIDE_ALL_DIALOG_LAYER: function () {
    for (var i = this.aOpenedLayers.length - 1; i >= 0; i--) {
      this.oApp.exec('HIDE_DIALOG_LAYER', [this.aOpenedLayers[i]]);
    }
  },

  $ON_HIDE_DIALOG_LAYER: function (elLayer) {
    elLayer = jindo.$(elLayer);

    if (elLayer) {
      elLayer.style.display = 'none';
    }
    this.aOpenedLayers = jindo.$A(this.aOpenedLayers).refuse(elLayer).$value();
  },

  $ON_TOGGLE_DIALOG_LAYER: function (elLayer, htOptions) {
    if (jindo.$A(this.aOpenedLayers).indexOf(elLayer)) {
      this.oApp.exec('SHOW_DIALOG_LAYER', [elLayer, htOptions]);
    } else {
      this.oApp.exec('HIDE_DIALOG_LAYER', [elLayer]);
    }
  },

  $ON_SET_DIALOG_LAYER_POSITION: function (elLayer, nTop, nLeft) {
    elLayer.style.top = nTop;
    elLayer.style.left = nLeft;
  }
  //@lazyload_js]
});
