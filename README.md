# ARVELOOM · ONICS 공개 준비

ONICS의 정식 명칭은 Our Next Intellectual Civilization System이다.

ARVELOOM은 ONICS 프로젝트의 글·연구 노트·해설을 공개하고 독자의 문의·의견을 받는 공간이다. GitHub Pages로 제공하는 정적 사이트다. 원고는 대시보드에서 준비하고 검토한 글 데이터를 이 저장소에 반영한다. 배포 전 변경 내용과 복구 지점을 확인한다.

## 현재 상태

- 첫 글 임시 제목: 금리는 문명의 체온계
- 문의 주소: contact@arveloom.com
- 첫 글 본문·출처·공개일은 준비 전이다. articles.json에 draft로만 등록한다.
- noindex를 유지한다. 실제 원고와 공개 검토가 끝난 뒤 검색 노출을 결정한다.
- 브랜드화와 결제·매출 기능은 후속 검토 범위다.

## 로컬 확인

대시보드 개발 서버를 실행한 상태에서 http://127.0.0.1:5173/public-site/index.html 을 연다. 파일을 직접 여는 대신 로컬 HTTP 서버를 사용한다. JSON을 읽는 기능은 HTTP 환경에서 확인한다.

## 글 데이터와 공개

articles.json의 version은 1이며 articles 배열에 글을 추가한다. id는 영문 소문자·숫자·하이픈 조합으로 고유하게 정한다. title·kind(글/연구 노트/해설)·category·status(draft/published)·summary·publishedAt·sections·sources를 사용한다.

- draft: 준비 중 목록에 제목만 표시한다. 본문·출처·날짜를 미리 만들어 넣지 않는다.
- published: 요약, 검토한 본문 sections, YYYY-MM-DD 형식의 실제 공개일이 필요하다. sources의 링크는 http/https만 허용한다.
- 글 주소는 #article/고유-id 형식이다. 직접 열기·뒤로 가기·닫기를 지원한다.
- 문의 버튼은 이메일 앱을 연다. 사용자가 직접 발송해야 하며 웹 서버가 메일을 발송하지 않는다.

대시보드의 ONICS 공개 준비에서 학습 기록·메모를 연결해 원고 기획을 만들고 원고 작업실에서 검토한다. 현재 대시보드 기획과 이 폴더의 articles.json은 자동 동기화되지 않는다. 검토한 원고를 글 데이터에 반영하고 공개 검토를 마친 뒤 배포한다. 배포 전 기존 저장소 버전과 복구 지점을 확인한다.
