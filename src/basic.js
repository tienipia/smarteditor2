import { SE2M_Toolbar } from './common/base/hp_SE2M_Toolbar';
import { SE2B_CSSLoader, SE_OuterIFrameControl, SE_ToolbarToggler } from './extra';
import {
  SE2M_FindReplacePlugin,
  SE2M_Quote,
  SE2M_SCharacter,
  SE2M_TableBlockStyler,
  SE2M_TableCreator,
  SE2M_TableEditor
} from './fundamental/advanced';
import {
  SE2M_Accessibility,
  SE2M_BGColor,
  SE2M_ColorPalette,
  SE2M_ExecCommand,
  SE2M_FontColor,
  SE2M_FontNameWithLayerUI,
  SE2M_FontSizeWithLayerUI,
  SE2M_Hyperlink,
  SE2M_LineHeightWithLayerUI,
  SE2M_LineStyler,
  SE_WYSIWYGStyleGetter,
  SE_WYSIWYGStyler
} from './fundamental/base';
import {
  SE2M_EditingModeChanger,
  SE_EditingAreaManager,
  SE_EditingAreaVerticalResizer,
  SE_EditingArea_HTMLSrc,
  SE_EditingArea_TEXT,
  SE_EditingArea_WYSIWYG,
  SE_PasteHandler,
  SE_WYSIWYGEnterKey
} from './fundamental/editing';
import { HuskyCore } from './husky_framework';
import { CorePlugin, HuskyRangeManager } from './husky_framework';
import { SE2M_QuickEditor_Common } from './quick_editor/hp_SE2M_QuickEditor_Common';
import { Hotkey } from './shortcut/hp_Hotkey';
import { SE_UndoRedo } from './undo_redo/hp_SE_UndoRedo';
import {
  ActiveLayerManager,
  DialogLayerManager,
  MessageManager,
  SE2M_UtilPlugin,
  StringConverterManager,
  Utils
} from './util';

export function createSEditor2(elIRField, htParams, elSeAppContainer) {
  if (!window.$Jindo) {
    parent.document.body.innerHTML =
      "진도 프레임웍이 필요합니다.<br>\n<a href='http://dev.naver.com/projects/jindo/download'>http://dev.naver.com/projects/jindo/download</a>에서 Jindo 1.5.3 버전의 jindo.min.js를 다운로드 받아 /js 폴더에 복사 해 주세요.\n(아직 Jindo 2 는 지원하지 않습니다.)";
    return;
  }

  var elAppContainer = elSeAppContainer;
  var elEditingArea = jindo.$$.getSingle('DIV.husky_seditor_editing_area_container', elAppContainer);
  var oWYSIWYGIFrame = jindo.$$.getSingle('IFRAME.se2_input_wysiwyg', elEditingArea);
  var oIRTextarea = elIRField ? elIRField : jindo.$$.getSingle('TEXTAREA.blind', elEditingArea);
  var oHTMLSrc = jindo.$$.getSingle('TEXTAREA.se2_input_htmlsrc', elEditingArea);
  var oTextArea = jindo.$$.getSingle('TEXTAREA.se2_input_text', elEditingArea);

  if (!htParams) {
    htParams = {};
    htParams.fOnBeforeUnload = null;
  }
  htParams.elAppContainer = elAppContainer; // 에디터 UI 최상위 element 셋팅
  htParams.oNavigator = jindo.$Agent().navigator(); // navigator 객체 셋팅
  htParams.I18N_LOCALE = htParams.I18N_LOCALE || 'ko_KR';

  var oEditor = new HuskyCore(htParams);
  oEditor.registerPlugin(new CorePlugin(htParams ? htParams.fOnAppLoad : null));
  oEditor.registerPlugin(new StringConverterManager());
  if (htParams.bSkipXssFilter !== true) {
    // 보안 필터링 플러그인 (TODO:소스분리 및 블랙리스트 옵션 추가)
    oEditor.registerPlugin({
      _rxFilter:
        /<\/*(?:applet|b(?:ase|gsound|link)|embed|frame(?:set)?|i(?:frame|layer)|l(?:ayer|ink)|meta|object|s(?:cript|tyle)|title|xml)[^>]*?>/gi,
      $ON_REGISTER_CONVERTERS: function () {
        var fXssFilter = jindo
          .$Fn(function (sHtml) {
            return sHtml.replace(this._rxFilter, '');
          }, this)
          .bind();
        this.oApp.exec('ADD_CONVERTER', ['HTMLSrc_TO_IR', fXssFilter]);
        this.oApp.exec('ADD_CONVERTER', ['IR_TO_DB', fXssFilter]);
      }
    });
  }

  var htDimension = {
    nMinHeight: 205,
    nMinWidth: parseInt(elIRField.style.minWidth, 10) || 570,
    nHeight: elIRField.style.height || elIRField.offsetHeight,
    nWidth: elIRField.style.width || elIRField.offsetWidth
  };

  var htConversionMode = {
    bUseVerticalResizer: htParams.bUseVerticalResizer,
    bUseModeChanger: htParams.bUseModeChanger
  };

  var aAdditionalFontList = htParams.aAdditionalFontList;

  oEditor.registerPlugin(
    new SE_EditingAreaManager('WYSIWYG', oIRTextarea, htDimension, htParams.fOnBeforeUnload, elAppContainer)
  );
  oEditor.registerPlugin(new SE_EditingArea_WYSIWYG(oWYSIWYGIFrame)); // Tab Editor 모드
  oEditor.registerPlugin(new SE_EditingArea_HTMLSrc(oHTMLSrc)); // Tab HTML 모드
  oEditor.registerPlugin(new SE_EditingArea_TEXT(oTextArea)); // Tab Text 모드
  oEditor.registerPlugin(new SE2M_EditingModeChanger(elAppContainer, htConversionMode)); // 모드간 변경(Editor, HTML, Text)
  oEditor.registerPlugin(new SE_PasteHandler()); // WYSIWYG Paste Handler

  oEditor.registerPlugin(new HuskyRangeManager(oWYSIWYGIFrame));
  oEditor.registerPlugin(new Utils());
  oEditor.registerPlugin(new SE2M_UtilPlugin());
  oEditor.registerPlugin(new SE_WYSIWYGStyler());
  oEditor.registerPlugin(new SE2M_Toolbar(elAppContainer));

  oEditor.registerPlugin(new Hotkey()); // 단축키
  oEditor.registerPlugin(new SE_EditingAreaVerticalResizer(elAppContainer, htConversionMode)); // 편집영역 리사이즈
  oEditor.registerPlugin(new DialogLayerManager());
  oEditor.registerPlugin(new ActiveLayerManager());
  oEditor.registerPlugin(new SE_WYSIWYGStyleGetter()); // 커서 위치 스타일 정보 가져오기

  oEditor.registerPlugin(new SE_WYSIWYGEnterKey('P')); // 엔터 시 처리, 현재는 P로 처리

  oEditor.registerPlugin(new SE2M_ColorPalette(elAppContainer)); // 색상 팔레트
  oEditor.registerPlugin(new SE2M_FontColor(elAppContainer)); // 글자색
  oEditor.registerPlugin(new SE2M_BGColor(elAppContainer)); // 글자배경색
  oEditor.registerPlugin(new SE2M_FontNameWithLayerUI(elAppContainer, aAdditionalFontList)); // 글꼴종류
  oEditor.registerPlugin(new SE2M_FontSizeWithLayerUI(elAppContainer)); // 글꼴크기

  oEditor.registerPlugin(new SE2M_LineStyler());
  oEditor.registerPlugin(new SE2M_ExecCommand(oWYSIWYGIFrame));
  oEditor.registerPlugin(new SE2M_LineHeightWithLayerUI(elAppContainer)); // 줄간격

  oEditor.registerPlugin(new SE2M_Quote(elAppContainer)); // 인용구
  oEditor.registerPlugin(new SE2M_Hyperlink(elAppContainer)); // 링크
  oEditor.registerPlugin(new SE2M_SCharacter(elAppContainer)); // 특수문자
  oEditor.registerPlugin(new SE2M_FindReplacePlugin(elAppContainer)); // 찾기/바꾸기
  oEditor.registerPlugin(new SE2M_TableCreator(elAppContainer)); // 테이블 생성
  oEditor.registerPlugin(new SE2M_TableEditor(elAppContainer)); // 테이블 편집
  oEditor.registerPlugin(new SE2M_TableBlockStyler(elAppContainer)); // 테이블 스타일
  // if (SE2M_AttachQuickPhoto) {
  //   oEditor.registerPlugin(new SE2M_AttachQuickPhoto(elAppContainer)); // 사진
  // }

  oEditor.registerPlugin(new MessageManager(oMessageMap, htParams.I18N_LOCALE));
  oEditor.registerPlugin(new SE2M_QuickEditor_Common(elAppContainer)); // 퀵에디터 공통(표, 이미지)

  oEditor.registerPlugin(new SE2B_CSSLoader()); // CSS lazy load
  if (window.frameElement) {
    oEditor.registerPlugin(new SE_OuterIFrameControl(elAppContainer, 100));
  }

  oEditor.registerPlugin(new SE_ToolbarToggler(elAppContainer, htParams.bUseToolbar));
  oEditor.registerPlugin(new SE2M_Accessibility(elAppContainer, htParams.I18N_LOCALE)); // 에디터내의 웹접근성 관련 기능모음 플러그인

  oEditor.registerPlugin(new SE_UndoRedo()); // Undo/Redo

  return oEditor;
}
