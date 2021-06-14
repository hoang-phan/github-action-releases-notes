# Github Action Release Notes javascript action

This action appends PR to milestone description

## Inputs

### `github-token`

**Required** Token to use Github API.


## Example usage

```
on:
  pull_request:
    types: [closed]

jobs:
  pull:
    runs-on: ubuntu-latest
    name: A job to Update milestone with Release Notes
    steps:
      - name: Update milestone
        id: hello
        uses: hoang-phan/github-action-releases-notes@v1.8
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
```
