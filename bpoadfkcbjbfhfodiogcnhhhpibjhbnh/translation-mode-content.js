// Content script for translation mode handling
(function() {
  // 번역 모드 상태
  const TRANSLATION_MODES = {
    ORIGINAL: 'original',
    DUAL: 'dual',
    TRANSLATION: 'translation'
  };

  // 메시지 리스너
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'changeTranslationMode') {
      applyTranslationMode(request.mode);
    }
  });

  // 페이지 로드 시 저장된 모드 적용
  chrome.storage.local.get(['translationMode'], (result) => {
    if (result.translationMode) {
      applyTranslationMode(result.translationMode);
    }
  });

  // 번역 모드 적용
  function applyTranslationMode(mode) {
    // Immersive Translate의 기존 클래스와 속성 활용
    const htmlElement = document.documentElement;
    
    switch(mode) {
      case TRANSLATION_MODES.ORIGINAL:
        // 원문만 표시
        htmlElement.setAttribute('imt-state', 'original');
        hideTranslations();
        break;
        
      case TRANSLATION_MODES.DUAL:
        // 이중언어 표시 (기본값)
        htmlElement.setAttribute('imt-state', 'dual');
        showBothLanguages();
        break;
        
      case TRANSLATION_MODES.TRANSLATION:
        // 번역문만 표시
        htmlElement.setAttribute('imt-state', 'translation');
        hideOriginals();
        break;
    }
  }

  // 번역문 숨기기
  function hideTranslations() {
    // Immersive Translate의 번역 요소들 숨기기
    const style = document.getElementById('translation-mode-style') || createStyleElement();
    style.textContent = `
      .immersive-translate-target-wrapper,
      .immersive-translate-target-translation-block-wrapper,
      .immersive-translate-target-inner {
        display: none !important;
      }
    `;
  }

  // 원문과 번역문 모두 표시
  function showBothLanguages() {
    const style = document.getElementById('translation-mode-style') || createStyleElement();
    style.textContent = `
      .immersive-translate-target-wrapper,
      .immersive-translate-target-translation-block-wrapper,
      .immersive-translate-target-inner {
        display: inline-block !important;
      }
      
      [imt-state="dual"] .immersive-translate-target-translation-block-wrapper {
        margin: 8px 0 !important;
      }
    `;
  }

  // 원문 숨기기
  function hideOriginals() {
    const style = document.getElementById('translation-mode-style') || createStyleElement();
    style.textContent = `
      /* 번역된 요소의 원문 숨기기 */
      .immersive-translate-text-wrapper > :not(.immersive-translate-target-wrapper) {
        display: none !important;
      }
      
      /* 번역문만 표시 */
      .immersive-translate-target-wrapper,
      .immersive-translate-target-translation-block-wrapper {
        display: inline-block !important;
        margin: 0 !important;
      }
      
      /* 줄바꿈 제거 */
      [imt-state="translation"] .immersive-translate-target-wrapper > br {
        display: none !important;
      }
    `;
  }

  // 스타일 요소 생성
  function createStyleElement() {
    const style = document.createElement('style');
    style.id = 'translation-mode-style';
    document.head.appendChild(style);
    return style;
  }

  // MutationObserver로 동적으로 추가되는 번역 요소 감지
  const observer = new MutationObserver((mutations) => {
    // 현재 모드 다시 적용
    chrome.storage.local.get(['translationMode'], (result) => {
      if (result.translationMode) {
        applyTranslationMode(result.translationMode);
      }
    });
  });

  // body가 준비되면 관찰 시작
  if (document.body) {
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['imt-state']
    });
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['imt-state']
      });
    });
  }
})();