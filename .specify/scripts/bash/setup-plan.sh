#!/usr/bin/env bash
# Initialize plan.md (and supporting files) for the current feature.
# Usage: setup-plan.sh [--json]

set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=common.sh
source "$HERE/common.sh"

JSON=0
if [[ "${1:-}" == "--json" ]]; then
  JSON=1
fi

FEATURE_DIR="$(feature_dir_from_branch)"
if [[ -z "$FEATURE_DIR" || ! -d "$FEATURE_DIR" ]]; then
  echo "error: no feature directory found for the current branch" >&2
  exit 1
fi

PLAN="${FEATURE_DIR}/plan.md"
mkdir -p "${FEATURE_DIR}/contracts" "${FEATURE_DIR}/checklists"

if [[ ! -f "$PLAN" ]]; then
  cp "$(repo_root)/.specify/templates/plan-template.md" "$PLAN"
  BRANCH="$(basename "$FEATURE_DIR")"
  sed -i.bak \
    -e "s|\[###-feature-name\]|${BRANCH}|g" \
    -e "s|\[DATE\]|$(date -u +%Y-%m-%d)|g" \
    "$PLAN"
  rm -f "${PLAN}.bak"
fi

touch "${FEATURE_DIR}/research.md" \
      "${FEATURE_DIR}/data-model.md" \
      "${FEATURE_DIR}/quickstart.md"

if (( JSON )); then
  json_out \
    "feature_dir=${FEATURE_DIR#$(repo_root)/}" \
    "plan=${PLAN#$(repo_root)/}"
else
  echo "Plan ready: ${PLAN#$(repo_root)/}"
fi
