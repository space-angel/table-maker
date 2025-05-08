# Table Maker 플러그인

간단한 Obsidian 테이블 생성 및 편집 플러그인입니다. 모달에서 클릭만으로 행·열 추가, 셀 병합, 드래그로 순서 변경 등을 지원합니다.

## 주요 기능

* 모달 UI를 통한 직관적인 테이블 생성
* 행/열 추가 및 삭제 버튼 지원 (추후)
* 셀 텍스트 편집 (클릭 후 입력)
* 드래그로 행·열 순서 변경
* 고정 너비, 스크롤 가능한 테이블 미리보기
* `Markdown` 형식으로 편리한 삽입

## 설치 방법

1. GitHub 저장소를 클론하거나 ZIP 파일을 다운로드:

   ```bash
   git clone https://github.com/space-angel/table-maker.git
   ```
2. Obsidian `vault/.obsidian/plugins` 폴더에 복사
3. Obsidian 설정 → 커뮤니티 플러그인 → 해당 플러그인 활성화

## 사용법

1. 명령 팔레트(CMD/CTRL+P)에서 **"테이블 생성기 열기"** 실행
2. 모달 내에서 행·열 수를 조정하고, 셀을 클릭해 텍스트 입력
3. **"테이블 삽입"** 버튼 클릭 시 현재 커서 위치에 Markdown 테이블 삽입
4. Obsidian 설정 → 단축키(Hotkeys) 메뉴에서 \*\*"테이블 생성기 열기"\*\*에 원하는 키 바인딩 설정

## 설정

* 플러그인 설정 탭에서 기본 행·열 개수를 변경 가능

## 개발 환경

* TypeScript, Obsidian API 기반
* `npm install` → `npm run build` 후 플러그인 배포

## 기여

PR 환영합니다. Issue 또는 Pull Request를 통해 제안해 주세요.

## 라이선스

MIT © space-angel
