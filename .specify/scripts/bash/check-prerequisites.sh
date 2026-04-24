#!/usr/bin/env bash
# Validate that prerequisite artifacts exist for the current command.
# Usage: check-prerequisites.sh [--json] --require spec|plan|tasks

set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=common.sh
source "$HERE/common.sh"

JSON=0
REQUIRE=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --json) JSON=1; shift ;;
    --require) REQUIRE="$2"; shift 2 ;;
    *) echo "unknown arg: $1" >&2; exit 2 ;;
  esac
done

FEATURE_DIR="$(feature_dir_from_branch)"
if [[ -z "$FEATURE_DIR" || ! -d "$FEATURE_DIR" ]]; then
  echo "error: no feature directory for the current branch; run /speckit.specify first" >&2
  exit 1
fi

check_file() {
  local f="$1"
  if [[ ! -s "${FEATURE_DIR}/${f}" ]]; then
    echo "error: missing or empty ${FEATURE_DIR#$(repo_root)/}/${f}" >&2
    exit 1
  fi
}

case "$REQUIRE" in
  spec)
    check_file spec.md
    ;;
  plan)
    check_file spec.md
    check_file plan.md
    ;;
  tasks)
    check_file spec.md
    check_file plan.md
    check_file tasks.md
    ;;
  "")
    check_file spec.md
    ;;
  *)
    echo "error: unknown --require value: $REQUIRE" >&2
    exit 2
    ;;
esac

if (( JSON )); then
  json_out \
    "feature_dir=${FEATURE_DIR#$(repo_root)/}" \
    "required=${REQUIRE:-spec}" \
    "ok=true"
else
  echo "ok"
fi
