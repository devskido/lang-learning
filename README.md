# Lang Learning - 언어 학습 도구

언어 학습을 위한 Chrome 확장 프로그램과 웹사이트 프로젝트입니다.

## 프로젝트 구조

```
lang-learning/
├── Spongify/                           # Chrome 확장 프로그램
│   ├── manifest.json
│   ├── popup.html
│   ├── background.js
│   └── ...
├── website/                            # 소개 웹사이트
│   ├── index.html
│   ├── styles/
│   ├── scripts/
│   └── images/
├── hanja-808-list.md                   # 한중일 공통 한자 목록
└── COCA60000.txt                       # 영어 빈도수 단어 목록
```

## Chrome 확장 프로그램

### 주요 기능
- 웹페이지 실시간 번역 (3가지 모드: 원문, 이중언어, 번역문)
- PDF 문서 번역
- 동영상 자막 번역
- 다양한 번역 엔진 지원

### 설치 방법
1. Chrome 브라우저에서 `chrome://extensions/` 접속
2. 우측 상단 "개발자 모드" 활성화
3. "압축해제된 확장 프로그램을 로드합니다" 클릭
4. `Spongify` 폴더 선택

## 웹사이트

### 로컬 실행
```bash
cd website
# Python 3
python -m http.server 8000
# 또는 Node.js
npx serve
```

### Vercel 배포
1. [Vercel](https://vercel.com)에서 GitHub 리포지토리 연결
2. Root Directory를 `website`로 설정
3. Deploy 클릭

## 기여하기

Pull Request는 언제나 환영합니다!

## 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다.