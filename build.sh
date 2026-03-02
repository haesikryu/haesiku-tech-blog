#!/usr/bin/env bash
set -euo pipefail

# ============================================================
# Haesiku Tech Blog - Build Script
# Backend (Gradle) + Frontend (Vite) + Docker Image Build
# ============================================================

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"

# --- Colors ---
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info()  { echo -e "${BLUE}[INFO]${NC}  $*"; }
log_ok()    { echo -e "${GREEN}[OK]${NC}    $*"; }
log_warn()  { echo -e "${YELLOW}[WARN]${NC}  $*"; }
log_error() { echo -e "${RED}[ERROR]${NC} $*"; }

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
    log_warn "docker not found. Docker image build will be skipped."
  fi

  if [ $missing -ne 0 ]; then
    exit 1
  fi
}

# --- Backend Build ---
build_backend() {
  log_info "Building Backend..."
  cd "$BACKEND_DIR"

  if [ ! -f "./gradlew" ]; then
    log_error "Gradle Wrapper not found in $BACKEND_DIR"
    exit 1
  fi

  chmod +x ./gradlew
  ./gradlew clean build -x test

  log_ok "Backend build successful: $BACKEND_DIR/build/libs/"
}

# --- Frontend Build ---
build_frontend() {
  log_info "Building Frontend..."
  cd "$FRONTEND_DIR"

  if [ ! -f "package.json" ]; then
    log_error "package.json not found in $FRONTEND_DIR"
    exit 1
  fi

  if [ ! -d "node_modules" ]; then
    log_info "Installing npm dependencies..."
    npm install
  fi

  npm run build

  log_ok "Frontend build successful: $FRONTEND_DIR/dist/"
}

# --- Docker Image Build ---
build_docker() {
  if ! command -v docker &>/dev/null; then
    log_warn "Skipping Docker build (docker not installed)."
    return 0
  fi

  log_info "Building Docker images..."
  cd "$ROOT_DIR"

  docker compose build --no-cache

  log_ok "Docker images built successfully."
}

# --- Main ---
main() {
  local skip_docker=false

  for arg in "$@"; do
    case "$arg" in
      --skip-docker) skip_docker=true ;;
      --help|-h)
        echo "Usage: $0 [--skip-docker] [--help]"
        echo "  --skip-docker  Skip Docker image build"
        exit 0
        ;;
    esac
  done

  echo ""
  echo "================================================"
  echo "  Haesiku Tech Blog - Full Build"
  echo "================================================"
  echo ""

  preflight
  build_backend
  build_frontend

  if [ "$skip_docker" = false ]; then
    build_docker
  fi

  echo ""
  log_ok "All builds completed successfully!"
  echo ""
}

main "$@"
