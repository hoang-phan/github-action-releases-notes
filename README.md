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
        uses: hoang-phan/github-action-releases-notes@v2.0.0
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          work-tracker-host: "https://your-work-tracker.com"
```
