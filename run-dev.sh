#!/usr/bin/env bash
set -euo pipefail

# ============================================================
# Haesiku Tech Blog - Development Environment
# PostgreSQL (Docker) + Backend (Spring Boot) + Frontend (Vite)
# ============================================================

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend/tech-board"
FRONTEND_DIR="$ROOT_DIR/frontend"

DB_CONTAINER="haesiku-blog-dev-db"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-haesiku_blog}"
DB_USER="${DB_USER:-postgres}"
DB_PASS="${DB_PASS:-postgres}"

# --- Colors ---
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info()  { echo -e "${BLUE}[INFO]${NC}  $*"; }
log_ok()    { echo -e "${GREEN}[OK]${NC}    $*"; }
log_warn()  { echo -e "${YELLOW}[WARN]${NC}  $*"; }
log_error() { echo -e "${RED}[ERROR]${NC} $*"; }

# PID tracking for cleanup
BACKEND_PID=""
FRONTEND_PID=""

cleanup() {
  echo ""
  log_info "Shutting down dev environment..."

  if [ -n "$FRONTEND_PID" ] && kill -0 "$FRONTEND_PID" 2>/dev/null; then
    kill "$FRONTEND_PID" 2>/dev/null || true
    wait "$FRONTEND_PID" 2>/dev/null || true
    log_ok "Frontend stopped."
  fi

  if [ -n "$BACKEND_PID" ] && kill -0 "$BACKEND_PID" 2>/dev/null; then
    kill "$BACKEND_PID" 2>/dev/null || true
    wait "$BACKEND_PID" 2>/dev/null || true
    log_ok "Backend stopped."
  fi

  log_info "PostgreSQL container ($DB_CONTAINER) is still running."
  log_info "To stop: docker stop $DB_CONTAINER"
  echo ""
}

trap cleanup EXIT INT TERM

# --- Pre-flight checks ---
preflight() {
  local missing=0

  if ! command -v java &>/dev/null; then
    log_error "java not found. Install JDK 17+."
    missing=1
  fi

  if ! command -v node &>/dev/null; then
    log_error "node not found. Install Node.js 18+."
    missing=1
  fi

  if ! command -v docker &>/dev/null; then
    log_error "docker not found. Install Docker Desktop."
    missing=1
  fi

  if [ $missing -ne 0 ]; then
    exit 1
  fi
}

# --- PostgreSQL ---
start_postgres() {
  if docker ps --format '{{.Names}}' | grep -q "^${DB_CONTAINER}$"; then
    log_ok "PostgreSQL already running ($DB_CONTAINER)."
    return 0
  fi

  if docker ps -a --format '{{.Names}}' | grep -q "^${DB_CONTAINER}$"; then
    log_info "Starting existing PostgreSQL container..."
    docker start "$DB_CONTAINER"
  else
    log_info "Creating PostgreSQL container..."
    docker run -d \
      --name "$DB_CONTAINER" \
      -e POSTGRES_DB="$DB_NAME" \
      -e POSTGRES_USER="$DB_USER" \
      -e POSTGRES_PASSWORD="$DB_PASS" \
      -p "${DB_PORT}:5432" \
      postgres:15-alpine
  fi

  # Wait for PostgreSQL to be ready
  log_info "Waiting for PostgreSQL..."
  local retries=30
  while [ $retries -gt 0 ]; do
    if docker exec "$DB_CONTAINER" pg_isready -U "$DB_USER" -d "$DB_NAME" &>/dev/null; then
      log_ok "PostgreSQL ready on port $DB_PORT."
      return 0
    fi
    retries=$((retries - 1))
    sleep 1
  done

  log_error "PostgreSQL failed to start within 30 seconds."
  exit 1
}

# --- Backend ---
start_backend() {
  log_info "Starting Backend (Spring Boot)..."
  cd "$BACKEND_DIR"

  if [ ! -f "./gradlew" ]; then
    log_error "Gradle Wrapper not found in $BACKEND_DIR"
    exit 1
  fi

  chmod +x ./gradlew

  DB_USERNAME="$DB_USER" DB_PASSWORD="$DB_PASS" \
    ./gradlew bootRun \
    --args="--spring.datasource.url=jdbc:postgresql://localhost:${DB_PORT}/${DB_NAME}" \
    &
  BACKEND_PID=$!

  # Wait for backend to be ready
  log_info "Waiting for Backend (port 8080)..."
  local retries=60
  while [ $retries -gt 0 ]; do
    if curl -s http://localhost:8080/actuator/health &>/dev/null; then
      log_ok "Backend ready on http://localhost:8080"
      return 0
    fi
    if ! kill -0 "$BACKEND_PID" 2>/dev/null; then
      log_error "Backend process exited unexpectedly."
      exit 1
    fi
    retries=$((retries - 1))
    sleep 2
  done

  log_warn "Backend health check timed out. It may still be starting..."
}

# --- Frontend ---
start_frontend() {
  log_info "Starting Frontend (Vite dev server)..."
  cd "$FRONTEND_DIR"

  if [ ! -d "node_modules" ]; then
    log_info "Installing npm dependencies..."
    npm install
  fi

  npm run dev &
  FRONTEND_PID=$!

  sleep 3
  if kill -0 "$FRONTEND_PID" 2>/dev/null; then
    log_ok "Frontend ready on http://localhost:5173"
  else
    log_error "Frontend failed to start."
    exit 1
  fi
}

# --- Main ---
main() {
  local component="all"

  for arg in "$@"; do
    case "$arg" in
      --db-only)   component="db" ;;
      --backend)   component="backend" ;;
      --frontend)  component="frontend" ;;
      --help|-h)
        echo "Usage: $0 [--db-only|--backend|--frontend] [--help]"
        echo "  --db-only    Start only PostgreSQL"
        echo "  --backend    Start PostgreSQL + Backend"
        echo "  --frontend   Start only Frontend (assumes DB + Backend running)"
        echo ""
        echo "Environment variables:"
        echo "  DB_PORT  PostgreSQL port (default: 5432)"
        echo "  DB_NAME  Database name   (default: haesiku_blog)"
        echo "  DB_USER  Database user   (default: postgres)"
        echo "  DB_PASS  Database pass   (default: postgres)"
        exit 0
        ;;
    esac
  done

  echo ""
  echo "================================================"
  echo "  Haesiku Tech Blog - Dev Environment"
  echo "================================================"
  echo ""

  preflight

  case "$component" in
    db)
      start_postgres
      ;;
    backend)
      start_postgres
      start_backend
      ;;
    frontend)
      start_frontend
      ;;
    all)
      start_postgres
      start_backend
      start_frontend
      ;;
  esac

  echo ""
  echo "================================================"
  echo "  Dev environment is running!"
  if [ "$component" = "all" ] || [ "$component" = "backend" ]; then
    echo "  PostgreSQL : localhost:$DB_PORT"
    echo "  Backend    : http://localhost:8080"
  fi
  if [ "$component" = "all" ] || [ "$component" = "frontend" ]; then
    echo "  Frontend   : http://localhost:5173"
  fi
  echo "  Press Ctrl+C to stop"
  echo "================================================"
  echo ""

  # Keep script alive until interrupted
  wait
}

main "$@"
