# Haesiku Tech Blog

![Java](https://img.shields.io/badge/Java-17-ED8B00?logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.5-6DB33F?logo=springboot&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

Markdown 기반 기술 블로그 플랫폼입니다. Spring Boot REST API 백엔드와 React SPA 프론트엔드로 구성되어 있으며, Docker Compose를 통해 한 번에 배포할 수 있습니다.

<!-- 스크린샷: 메인 페이지 -->
<!-- ![메인 페이지](docs/screenshots/home.png) -->

---

## 주요 기능

- **게시글 CRUD** - Markdown 작성, 실시간 미리보기, 임시저장(localStorage)
- **카테고리 & 태그** - 계층적 분류와 다중 태그 지원
- **검색** - 제목/내용 기반 키워드 검색
- **다크 모드** - 시스템 설정 연동 및 수동 토글
- **반응형 디자인** - 모바일/태블릿/데스크톱 대응
- **관리자 패널** - 게시글 관리, 발행 상태 토글, 삭제
- **SEO** - 페이지별 메타 태그, Open Graph 지원
- **API 문서** - Swagger UI 자동 생성 (`/swagger-ui.html`)

---

## 기술 스택

### Backend

| 기술 | 버전 | 용도 |
|------|------|------|
| Java | 17 | 언어 |
| Spring Boot | 3.2.5 | 웹 프레임워크 |
| Spring Data JPA | - | ORM / 데이터 접근 |
| Spring Validation | - | 입력값 검증 |
| Spring Actuator | - | 헬스체크 / 모니터링 |
| SpringDoc OpenAPI | 2.5.0 | Swagger UI / API 문서 |
| MapStruct | 1.5.5 | DTO ↔ Entity 매핑 |
| Lombok | - | 보일러플레이트 제거 |
| PostgreSQL | 15 | 데이터베이스 |
| Gradle | 8.x | 빌드 도구 |

### Frontend

| 기술 | 버전 | 용도 |
|------|------|------|
| React | 18 | UI 라이브러리 |
| TypeScript | 5.4 | 타입 안전성 |
| Vite | 5 | 빌드 도구 / 개발 서버 |
| Tailwind CSS | 4 | 유틸리티 CSS |
| React Router | 6 | 클라이언트 라우팅 |
| TanStack Query | 5 | 서버 상태 관리 |
| Zustand | 5 | 클라이언트 상태 관리 |
| React Hook Form + Zod | - | 폼 관리 / 유효성 검증 |
| react-markdown | 10 | Markdown 렌더링 |
| react-helmet-async | 2 | SEO 메타 태그 |

### Infrastructure

| 기술 | 용도 |
|------|------|
| Docker / Docker Compose | 컨테이너 오케스트레이션 |
| Nginx | 프론트엔드 서빙 / 리버스 프록시 |

---

## 아키텍처

```
┌─────────────────────────────────────────────────────┐
│                    Client (Browser)                  │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP :80
┌──────────────────────▼──────────────────────────────┐
│                  Nginx (Frontend)                     │
│  ┌─────────────────┐   ┌──────────────────────────┐ │
│  │  React SPA      │   │  /api/* → Reverse Proxy  │ │
│  │  (Static Files) │   │  → backend:8080          │ │
│  └─────────────────┘   └──────────────────────────┘ │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP :8080
┌──────────────────────▼──────────────────────────────┐
│               Spring Boot (Backend)                   │
│                                                       │
│  Controller → Service → Repository → JPA              │
│                                                       │
│  ┌──────────┐  ┌──────────┐  ┌───────────────────┐  │
│  │ Post API │  │ Category │  │ Tag API           │  │
│  │          │  │ API      │  │                   │  │
│  └──────────┘  └──────────┘  └───────────────────┘  │
│                                                       │
│  Swagger UI: /swagger-ui.html                         │
│  Actuator:   /actuator/health                         │
└──────────────────────┬──────────────────────────────┘
                       │ JDBC :5432
┌──────────────────────▼──────────────────────────────┐
│              PostgreSQL 15 (Alpine)                   │
│                                                       │
│  Database: haesiku_blog                               │
│  Tables: posts, categories, tags, post_tags           │
└─────────────────────────────────────────────────────┘
```

### 프로젝트 구조

```
haesiku-tech-blog/
├── backend/                      # Spring Boot
│   ├── src/main/java/com/haesiku/blog/
│   │   ├── config/               # JPA, OpenAPI 설정
│   │   ├── controller/           # REST Controller
│   │   ├── dto/                  # Request/Response DTO (record)
│   │   ├── entity/               # JPA Entity
│   │   ├── exception/            # 예외 처리
│   │   ├── mapper/               # MapStruct Mapper
│   │   ├── repository/           # JPA Repository
│   │   ├── service/              # 비즈니스 로직
│   │   └── util/                 # 유틸리티 (SlugUtils)
│   ├── src/main/resources/
│   │   └── application.yml
│   ├── build.gradle
│   └── Dockerfile
├── frontend/                     # React + TypeScript
│   ├── src/
│   │   ├── api/                  # Axios API 클라이언트
│   │   ├── components/
│   │   │   ├── common/           # Button, Input, Card, Badge, ...
│   │   │   ├── layout/           # Header, Footer, Sidebar, Layout
│   │   │   └── post/             # PostCard, PostEditor, MarkdownEditor, ...
│   │   ├── hooks/                # React Query 커스텀 훅
│   │   ├── pages/                # 페이지 컴포넌트
│   │   │   └── admin/            # 관리자 페이지
│   │   ├── store/                # Zustand 상태 관리
│   │   ├── types/                # TypeScript 타입 정의
│   │   └── utils/                # 상수, Zod 스키마
│   ├── nginx.conf
│   ├── package.json
│   ├── vite.config.ts
│   └── Dockerfile
├── docker-compose.yml
├── build.sh                      # 전체 빌드 스크립트
├── run-dev.sh                    # 개발 환경 실행 스크립트
├── deploy.sh                     # Docker Compose 배포 스크립트
└── README.md
```

---

## 로컬 개발 환경 설정

### 사전 요구사항

| 도구 | 최소 버전 | 확인 명령어 |
|------|-----------|-------------|
| Java (JDK) | 17+ | `java -version` |
| Node.js | 18+ | `node -v` |
| npm | 9+ | `npm -v` |
| Docker | 20+ | `docker -v` |
| Docker Compose | v2+ | `docker compose version` |

### 방법 1: 개발 스크립트 사용 (권장)

```bash
# 전체 개발 환경 실행 (PostgreSQL + Backend + Frontend)
./run-dev.sh

# 개별 실행
./run-dev.sh --db-only      # PostgreSQL만
./run-dev.sh --backend      # PostgreSQL + Backend
./run-dev.sh --frontend     # Frontend만 (DB/Backend 별도 실행 필요)
```

실행 후 접속:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080/api
- **Swagger UI**: http://localhost:8080/swagger-ui.html

### 방법 2: 수동 실행

**1. PostgreSQL 실행**

```bash
docker run -d \
  --name haesiku-blog-dev-db \
  -e POSTGRES_DB=haesiku_blog \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  postgres:15-alpine
```

**2. Backend 실행**

```bash
cd backend
./gradlew bootRun
```

**3. Frontend 실행**

```bash
cd frontend
npm install
npm run dev
```

### 방법 3: Docker Compose (프로덕션)

```bash
# 빌드 후 실행
./deploy.sh up --build

# 서비스 상태 확인
./deploy.sh status

# 로그 확인
./deploy.sh logs backend

# 종료
./deploy.sh down

# 종료 + 볼륨 삭제 (DB 데이터 초기화)
./deploy.sh clean
```

실행 후 접속:
- **Frontend**: http://localhost
- **Backend API**: http://localhost:8080/api
- **Swagger UI**: http://localhost:8080/swagger-ui.html

### 빌드

```bash
# 전체 빌드 (Backend + Frontend + Docker)
./build.sh

# Docker 빌드 생략
./build.sh --skip-docker
```

---

## API 엔드포인트

전체 API 문서는 서버 실행 후 [Swagger UI](http://localhost:8080/swagger-ui.html)에서 확인할 수 있습니다.

### Posts

| Method | Endpoint | 설명 |
|--------|----------|------|
| `GET` | `/api/posts` | 발행된 게시글 목록 (페이징) |
| `GET` | `/api/posts/{slug}` | 게시글 상세 조회 (조회수 +1) |
| `GET` | `/api/posts/search?keyword=` | 게시글 검색 |
| `POST` | `/api/posts` | 게시글 생성 |
| `PUT` | `/api/posts/{id}` | 게시글 수정 |
| `DELETE` | `/api/posts/{id}` | 게시글 삭제 |
| `PATCH` | `/api/posts/{id}/publish` | 발행 상태 토글 |

### Categories

| Method | Endpoint | 설명 |
|--------|----------|------|
| `GET` | `/api/categories` | 전체 카테고리 목록 |
| `GET` | `/api/categories/{slug}/posts` | 카테고리별 게시글 (페이징) |
| `POST` | `/api/categories` | 카테고리 생성 |

### Tags

| Method | Endpoint | 설명 |
|--------|----------|------|
| `GET` | `/api/tags` | 전체 태그 목록 |
| `GET` | `/api/tags/{slug}/posts` | 태그별 게시글 (페이징) |

### 공통 페이징 파라미터

| 파라미터 | 기본값 | 설명 |
|----------|--------|------|
| `page` | 0 | 페이지 번호 (0부터 시작) |
| `size` | 10 | 페이지 크기 |
| `sort` | `createdAt,desc` | 정렬 기준 |

### 요청/응답 예시

<details>
<summary><b>게시글 생성 (POST /api/posts)</b></summary>

**Request**
```json
{
  "title": "Spring Boot 시작하기",
  "content": "# Spring Boot\nSpring Boot는 ...",
  "summary": "Spring Boot 입문 가이드",
  "author": "haesiku",
  "categoryId": 1,
  "tagNames": ["Spring", "Java", "Backend"]
}
```

**Response (201 Created)**
```json
{
  "id": 1,
  "title": "Spring Boot 시작하기",
  "content": "# Spring Boot\nSpring Boot는 ...",
  "summary": "Spring Boot 입문 가이드",
  "author": "haesiku",
  "slug": "spring-boot-sijaghagi",
  "status": "DRAFT",
  "viewCount": 0,
  "category": {
    "id": 1,
    "name": "Spring Framework",
    "slug": "spring-framework",
    "description": "Spring 관련 기술 포스트",
    "createdAt": "2025-01-10T09:00:00"
  },
  "tags": [
    { "id": 1, "name": "Spring", "slug": "spring", "createdAt": "2025-01-10T09:00:00" },
    { "id": 2, "name": "Java", "slug": "java", "createdAt": "2025-01-10T09:00:00" }
  ],
  "createdAt": "2025-01-15T10:30:00",
  "updatedAt": "2025-01-15T10:30:00",
  "publishedAt": null
}
```
</details>

<details>
<summary><b>페이징 응답 (GET /api/posts)</b></summary>

```json
{
  "content": [
    { "id": 1, "title": "Spring Boot 시작하기", "..." : "..." }
  ],
  "totalElements": 42,
  "totalPages": 5,
  "currentPage": 0,
  "size": 10
}
```
</details>

<details>
<summary><b>에러 응답 (400 Bad Request)</b></summary>

```json
{
  "status": 400,
  "message": "입력값 검증에 실패했습니다",
  "errors": [
    "title: 제목은 필수입니다",
    "author: 작성자는 필수입니다"
  ],
  "timestamp": "2025-01-15T10:30:00"
}
```
</details>

---

## 환경변수

### Backend

| 변수 | 기본값 | 설명 |
|------|--------|------|
| `DB_USERNAME` | `postgres` | DB 사용자 이름 |
| `DB_PASSWORD` | `postgres` | DB 비밀번호 |
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://localhost:5432/haesiku_blog` | DB 접속 URL |
| `SPRING_JPA_HIBERNATE_DDL_AUTO` | `update` | DDL 전략 |
| `SERVER_PORT` | `8080` | 서버 포트 |

### Frontend (개발 모드)

| 변수 | 기본값 | 설명 |
|------|--------|------|
| `VITE_API_BASE_URL` | `/api` | API base URL |

### run-dev.sh

| 변수 | 기본값 | 설명 |
|------|--------|------|
| `DB_PORT` | `5432` | PostgreSQL 포트 |
| `DB_NAME` | `haesiku_blog` | 데이터베이스 이름 |
| `DB_USER` | `postgres` | DB 사용자 이름 |
| `DB_PASS` | `postgres` | DB 비밀번호 |

---

## 향후 계획

- [ ] **JWT 인증** - Spring Security + JWT 토큰 기반 인증/인가
- [ ] **이미지 업로드** - S3 또는 로컬 파일 시스템 연동
- [ ] **댓글 시스템** - 게시글 댓글/대댓글 기능
- [ ] **조회수 고도화** - Redis 기반 중복 조회 방지
- [ ] **전문 검색** - Elasticsearch 연동
- [ ] **CI/CD** - GitHub Actions 자동 빌드/배포 파이프라인
- [ ] **모니터링** - Prometheus + Grafana 메트릭 대시보드
- [ ] **마이크로서비스 전환** - 게시글/인증/검색 서비스 분리
- [ ] **SSR/SSG** - Next.js 마이그레이션으로 SEO 강화
- [ ] **테스트 강화** - JUnit 5 단위 테스트 + Playwright E2E 테스트

---

## 라이선스

이 프로젝트는 [MIT License](LICENSE) 하에 배포됩니다.

```
MIT License

Copyright (c) 2025 Haesiku

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
