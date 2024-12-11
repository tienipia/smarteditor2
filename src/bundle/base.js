import '../fundamental/advanced/hp_SE2M_FindReplacePlugin.js';
import '../fundamental/advanced/hp_SE2M_Quote.js';
import '../fundamental/advanced/hp_SE2M_SCharacter.js';
import '../fundamental/advanced/hp_SE2M_StyleRemover.js';
import '../fundamental/advanced/hp_SE2M_TableBlockStyler.js';
import '../fundamental/advanced/hp_SE2M_TableCreator.js';
import '../fundamental/advanced/hp_SE2M_TableEditor.js';
import { SE_EditingAreaManager } from '../fundamental/editing';

const __VERSION__ = '2.0.0';
const __HASH__ = 'b1e2f4c';

window.nSE2Version = __VERSION__ + '.' + __HASH__;
SE_EditingAreaManager.version = {
  revision: __HASH__,
  type: 'open',
  number: __VERSION__
};
