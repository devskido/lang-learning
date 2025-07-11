// 번역 모드 토글 기능
(function() {
  // 번역 모드 상태
  const TRANSLATION_MODES = {
    ORIGINAL: 'original',
    DUAL: 'dual',
    TRANSLATION: 'translation'
  };

  // 현재 모드 저장
  let currentMode = TRANSLATION_MODES.DUAL;

  // 모드별 아이콘 SVG
  const modeIcons = {
    [TRANSLATION_MODES.ORIGINAL]: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <line x1="7" y1="9" x2="17" y2="9" />
      <line x1="7" y1="12" x2="17" y2="12" />
      <line x1="7" y1="15" x2="12" y2="15" />
    </svg>`,
    [TRANSLATION_MODES.DUAL]: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="2" y="5" width="8" height="14" rx="1" />
      <rect x="14" y="5" width="8" height="14" rx="1" />
      <line x1="4" y1="9" x2="8" y2="9" />
      <line x1="16" y1="9" x2="20" y2="9" />
      <line x1="4" y1="12" x2="8" y2="12" />
      <line x1="16" y1="12" x2="20" y2="12" />
    </svg>`,
    [TRANSLATION_MODES.TRANSLATION]: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M7 9h10M7 12h10M7 15h6" />
      <path d="M9 3l2 2M15 3l-2 2" />
    </svg>`
  };

  // 모드별 툴팁
  const modeTooltips = {
    [TRANSLATION_MODES.ORIGINAL]: '원문만 보기',
    [TRANSLATION_MODES.DUAL]: '이중언어로 보기',
    [TRANSLATION_MODES.TRANSLATION]: '번역문만 보기'
  };

  // 저장된 모드 불러오기
  chrome.storage.local.get(['translationMode'], (result) => {
    if (result.translationMode) {
      currentMode = result.translationMode;
    }
  });

  // 모드 변경 함수
  function switchMode(mode) {
    currentMode = mode;
    chrome.storage.local.set({ translationMode: mode });
    
    // 현재 탭에 모드 변경 메시지 전송
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'changeTranslationMode',
          mode: mode
        });
      }
    });

    updateUI();
  }

  // UI 업데이트
  function updateUI() {
    const container = document.getElementById('translation-mode-container');
    if (!container) return;

    // 모든 버튼의 활성 상태 업데이트
    Object.keys(TRANSLATION_MODES).forEach(key => {
      const mode = TRANSLATION_MODES[key];
      const button = container.querySelector(`[data-mode="${mode}"]`);
      if (button) {
        if (mode === currentMode) {
          button.classList.add('active');
        } else {
          button.classList.remove('active');
        }
      }
    });
  }

  // 모드 토글 UI 생성
  function createModeToggleUI() {
    const container = document.createElement('div');
    container.id = 'translation-mode-container';
    container.className = 'translation-mode-container';
    
    // 각 모드별 버튼 생성
    Object.keys(TRANSLATION_MODES).forEach(key => {
      const mode = TRANSLATION_MODES[key];
      const button = document.createElement('button');
      button.className = 'translation-mode-button';
      button.setAttribute('data-mode', mode);
      button.innerHTML = modeIcons[mode];
      button.title = modeTooltips[mode];
      
      if (mode === currentMode) {
        button.classList.add('active');
      }
      
      button.addEventListener('click', () => switchMode(mode));
      container.appendChild(button);
    });

    return container;
  }

  // DOM이 로드되면 UI 추가
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    // popup.html의 mount 요소 찾기
    const mountElement = document.getElementById('mount');
    if (!mountElement) return;

    // MutationObserver로 React 렌더링 감지
    const observer = new MutationObserver((mutations) => {
      // popup UI가 렌더링되면 모드 토글 UI 추가
      const header = mountElement.querySelector('header') || mountElement.querySelector('nav');
      if (header && !document.getElementById('translation-mode-container')) {
        const modeToggleUI = createModeToggleUI();
        header.appendChild(modeToggleUI);
        observer.disconnect();
      }
    });

    observer.observe(mountElement, {
      childList: true,
      subtree: true
    });
  }
})();