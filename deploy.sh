#!/usr/bin/env bash
set -euo pipefail

# ============================================================
# Haesiku Tech Blog - Deploy Script
# Docker Compose full stack deployment
# ============================================================

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
COMPOSE_FILE="$ROOT_DIR/docker-compose.yml"

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

# --- Pre-flight checks ---
preflight() {
  if ! command -v docker &>/dev/null; then
    log_error "docker not found. Install Docker Desktop."
    exit 1
  fi

  if ! docker info &>/dev/null; then
    log_error "Docker daemon is not running."
    exit 1
  fi

  if [ ! -f "$COMPOSE_FILE" ]; then
    log_error "docker-compose.yml not found at $COMPOSE_FILE"
    exit 1
  fi
}

# --- Commands ---
cmd_up() {
  local build_flag=""
  if [ "${1:-}" = "--build" ]; then
    build_flag="--build"
    log_info "Building images before starting..."
  fi

  log_info "Starting all services..."
  docker compose -f "$COMPOSE_FILE" up -d $build_flag

  log_info "Waiting for services to be healthy..."
  wait_for_healthy

  echo ""
  log_ok "All services are running!"
  echo ""
  echo "  PostgreSQL : localhost:5432"
  echo "  Tech-board : http://localhost:8080"
  echo "  Frontend   : http://localhost:80"
  echo ""
}

cmd_down() {
  log_info "Stopping all services..."
  docker compose -f "$COMPOSE_FILE" down
  log_ok "All services stopped."
}

cmd_restart() {
  log_info "Restarting all services..."
  docker compose -f "$COMPOSE_FILE" restart
  log_ok "All services restarted."
}

cmd_status() {
  echo ""
  echo "=== Service Status ==="
  docker compose -f "$COMPOSE_FILE" ps
  echo ""
}

cmd_logs() {
  local service="${1:-}"
  if [ -n "$service" ]; then
    docker compose -f "$COMPOSE_FILE" logs -f "$service"
  else
    docker compose -f "$COMPOSE_FILE" logs -f
  fi
}

cmd_clean() {
  log_warn "This will stop all services and remove volumes (DB data will be lost)."
  read -rp "Are you sure? (y/N): " confirm
  if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
    docker compose -f "$COMPOSE_FILE" down -v
    log_ok "All services stopped and volumes removed."
  else
    log_info "Cancelled."
  fi
}

wait_for_healthy() {
  local retries=60
  while [ $retries -gt 0 ]; do
    local all_healthy=true

    for service in postgres tech-board frontend; do
      local health
      health=$(docker compose -f "$COMPOSE_FILE" ps "$service" --format '{{.Health}}' 2>/dev/null || echo "unknown")
      if [ "$health" != "healthy" ]; then
        all_healthy=false
        break
      fi
    done

    if [ "$all_healthy" = true ]; then
      return 0
    fi

    retries=$((retries - 1))
    sleep 5
  done

  log_warn "Timeout waiting for all services. Check status with: $0 status"
}

# --- Usage ---
usage() {
  echo ""
  echo "Usage: $0 <command> [options]"
  echo ""
  echo "Commands:"
  echo "  up [--build]        Start all services (--build to rebuild images)"
  echo "  down                Stop all services"
  echo "  restart             Restart all services"
  echo "  status              Show service status"
  echo "  logs [service]      Tail service logs (postgres|tech-board|frontend)"
  echo "  clean               Stop services and remove volumes (destructive)"
  echo ""
  echo "Examples:"
  echo "  $0 up --build       Build and start fresh"
  echo "  $0 logs tech-board  Follow tech-board logs"
  echo "  $0 status           Check running services"
  echo ""
}

# --- Main ---
main() {
  echo ""
  echo "================================================"
  echo "  Haesiku Tech Blog - Deploy"
  echo "================================================"
  echo ""

  preflight

  local cmd="${1:-}"
  shift || true

  case "$cmd" in
    up)       cmd_up "$@" ;;
    down)     cmd_down ;;
    restart)  cmd_restart ;;
    status)   cmd_status ;;
    logs)     cmd_logs "$@" ;;
    clean)    cmd_clean ;;
    *)        usage; exit 1 ;;
  esac
}

main "$@"
