#!/usr/bin/env bash

set -eo pipefail

function main() {
    local git_tag
    git_tag=$(git describe --abbrev=0 --tags)

    local git_commit
    git_commit=$(git rev-parse --short HEAD)

    gcloud builds submit \
        --config=cloudbuild.yaml \
        --substitutions=_BUILD_ID="$git_tag-$git_commit" \
        .
}

main
