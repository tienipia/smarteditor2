import { createSEditor2 } from '../basic';
import './base';
import './extra';
import './husky-range';
// full 버전에서 사용하지 않는 모듈
import './lazy';

if (window.frameElement) {
  jindo.$('se2_sample').style.display = 'none';
} else {
  var oEditor = createSEditor2(jindo.$('ir1'), {
    bUseToolbar: true, // 툴바 사용 여부 (true:사용/ false:사용하지 않음)
    bUseVerticalResizer: true, // 입력창 크기 조절바 사용 여부 (true:사용/ false:사용하지 않음)
    bUseModeChanger: true, // 모드 탭(Editor | HTML | TEXT) 사용 여부 (true:사용/ false:사용하지 않음)
    //bSkipXssFilter : true,		// client-side xss filter 무시 여부 (true:사용하지 않음 / 그외:사용)
    //aAdditionalFontList : [["MS UI Gothic", "MS UI Gothic"], ["Comic Sans MS", "Comic Sans MS"],["TEST","TEST"]],	// 추가 글꼴 목록
    fOnBeforeUnload: function () {
      //예제 코드
      //return "내용이 변경되었습니다.";
    }
  });

  oEditor.run({
    fnOnAppReady: function () {
      //예제 코드
      //oEditor.exec("PASTE_HTML", ["로딩이 완료된 후에 본문에 삽입되는 text입니다."]);
    }
  });

  function pasteHTML() {
    var sHTML = "<span style='color:#FF0000;'>이미지도 같은 방식으로 삽입합니다.</span>";
    oEditor.exec('PASTE_HTML', [sHTML]);
  }

  function showHTML() {
    var sHTML = oEditor.getIR();
    alert(sHTML);
  }

  function submitContents() {
    oEditor.exec('UPDATE_CONTENTS_FIELD'); // 에디터의 내용이 textarea에 적용됩니다.

    // 에디터의 내용에 대한 값 검증은 이곳에서 document.getElementById("ir1").value를 이용해서 처리하면 됩니다.
    jindo.$('ir1').form.submit();
  }

  function setDefaultFont() {
    var sDefaultFont = '궁서';
    var nFontSize = 24;
    oEditor.setDefaultFont(sDefaultFont, nFontSize);
  }
}
