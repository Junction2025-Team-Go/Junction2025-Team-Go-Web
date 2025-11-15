# Junction2025-Team-Go-Web

hei!local 웹 애플리케이션

## 기능

- **좌측 영역**: 유튜브 쇼츠 스타일의 세로 스크롤 영상 플레이어
  - 위아래 스크롤로 영상을 넘길 수 있음
  - 각 영상마다 레스토랑/장소 정보 표시
  - 좋아요, 댓글, 공유 기능

- **우측 영역**: 구글 지도
  - 현재 위치 자동 감지 및 표시
  - 장소별 핀 표시
  - 핀 클릭 시 좌측에 해당 정보 표시

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env` 파일을 생성하고 Google Maps API 키를 설정하세요:

```
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### 3. 개발 서버 실행

```bash
npm run dev
```

### 4. 빌드

```bash
npm run build
```

## 기술 스택

- React 18
- TypeScript
- Vite
- Google Maps API (@react-google-maps/api)

## 백엔드 연동 준비

현재는 임시 데이터를 사용하고 있습니다. 백엔드 API가 준비되면 다음 파일들을 수정하세요:

- `src/App.tsx`: API 호출 로직 추가
- `src/types.ts`: API 응답 타입에 맞게 수정

## 프로젝트 구조

```
src/
  ├── components/
  │   ├── VideoPlayer.tsx    # 좌측 영상 플레이어
  │   ├── VideoPlayer.css
  │   ├── MapView.tsx         # 우측 지도 뷰
  │   └── MapView.css
  ├── App.tsx                 # 메인 앱 컴포넌트
  ├── App.css
  ├── main.tsx                # 진입점
  ├── index.css               # 전역 스타일
  └── types.ts                # TypeScript 타입 정의
```