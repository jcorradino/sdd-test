#!/usr/bin/env bash
# Create a new feature branch and spec directory.
# Usage: create-new-feature.sh [--json] "Short description of the feature"

set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=common.sh
source "$HERE/common.sh"

JSON=0
if [[ "${1:-}" == "--json" ]]; then
  JSON=1
  shift
fi

if [[ $# -eq 0 ]]; then
  echo "error: feature description required" >&2
  exit 1
fi

DESC="$*"
NUM="$(next_feature_number)"
SLUG="$(slugify "$DESC")"
BRANCH="${NUM}-${SLUG}"
FEATURE_DIR="$(specs_dir)/${BRANCH}"
SPEC_FILE="${FEATURE_DIR}/spec.md"

git checkout -b "$BRANCH" 2>/dev/null || git checkout "$BRANCH"
mkdir -p "${FEATURE_DIR}/contracts" "${FEATURE_DIR}/checklists"

if [[ ! -f "$SPEC_FILE" ]]; then
  cp "$(repo_root)/.specify/templates/spec-template.md" "$SPEC_FILE"
  sed -i.bak \
    -e "s|\[FEATURE NAME\]|${DESC}|" \
    -e "s|\[###-feature-name\]|${BRANCH}|" \
    -e "s|\[DATE\]|$(date -u +%Y-%m-%d)|" \
    "$SPEC_FILE"
  rm -f "${SPEC_FILE}.bak"
fi

# Record the active feature for downstream commands.
mkdir -p "$(repo_root)/.specify"
printf '{"feature_directory":"specs/%s"}\n' "$BRANCH" \
  > "$(repo_root)/.specify/feature.json"

if (( JSON )); then
  json_out \
    "branch=${BRANCH}" \
    "feature_dir=specs/${BRANCH}" \
    "spec_file=specs/${BRANCH}/spec.md"
else
  echo "Created branch: ${BRANCH}"
  echo "Spec:          specs/${BRANCH}/spec.md"
fi
