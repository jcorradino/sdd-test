#!/usr/bin/env bash
# Shared helpers for spec-kit scripts.

set -euo pipefail

repo_root() {
  git rev-parse --show-toplevel
}

specs_dir() {
  echo "$(repo_root)/specs"
}

current_branch() {
  git rev-parse --abbrev-ref HEAD
}

# Resolve the feature directory for the current branch.
# Convention: branch `NNN-slug` → `specs/NNN-slug/`.
feature_dir_from_branch() {
  local branch
  branch="$(current_branch)"
  if [[ "$branch" =~ ^[0-9]+-[a-z0-9-]+$ ]]; then
    echo "$(specs_dir)/$branch"
    return 0
  fi
  # Fallback: most recently modified spec dir.
  ls -1dt "$(specs_dir)"/*/ 2>/dev/null | head -n 1 | sed 's:/$::'
}

# Next feature number based on existing specs/NNN-* directories.
next_feature_number() {
  local max=0 n
  if [[ -d "$(specs_dir)" ]]; then
    for d in "$(specs_dir)"/*/; do
      [[ -d "$d" ]] || continue
      n="$(basename "$d" | awk -F- '{print $1}')"
      if [[ "$n" =~ ^[0-9]+$ ]] && (( 10#$n > max )); then
        max=$((10#$n))
      fi
    done
  fi
  printf "%03d" $((max + 1))
}

# Slugify a free-form description.
slugify() {
  echo "$1" \
    | tr '[:upper:]' '[:lower:]' \
    | sed -E 's/[^a-z0-9]+/-/g; s/^-+|-+$//g' \
    | cut -c1-40
}

json_out() {
  # Emit a flat JSON object from key=value pairs.
  local first=1
  printf '{'
  for kv in "$@"; do
    local k="${kv%%=*}"
    local v="${kv#*=}"
    if (( first )); then first=0; else printf ','; fi
    printf '"%s":"%s"' "$k" "$v"
  done
  printf '}\n'
}
