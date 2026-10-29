#!/usr/bin/env bash
set -euo pipefail

image="${1:?Image tag required}"
port="${2:-3000}"
name=edutasks
backup=edutasks-previous
[[ "$image" =~ ^edutasks:[a-f0-9]{40}$ ]] || exit 1
[[ "$port" =~ ^[0-9]+$ ]] && (( port >= 1 && port <= 65535 )) || exit 1

# Do not overwrite a backup left by an interrupted deployment.
if docker container inspect "$backup" >/dev/null 2>&1; then
  echo "Container $backup already exists. Inspect it before deploying again." >&2
  exit 1
fi
had_previous=false
if docker container inspect "$name" >/dev/null 2>&1; then
  docker stop "$name"
  docker rename "$name" "$backup"
  had_previous=true
fi

rollback() {
  docker logs "$name" 2>/dev/null || true
  docker rm -f "$name" 2>/dev/null || true
  if "$had_previous"; then
    docker rename "$backup" "$name"
    docker start "$name"
  fi
}
trap rollback ERR
docker run -d --name "$name" --restart unless-stopped \
  -p "$port:3000" "$image"
trap - ERR
if "$had_previous"; then docker rm "$backup"; fi
echo "Deployment succeeded: $image on port $port"
