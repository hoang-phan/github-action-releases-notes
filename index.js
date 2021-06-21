const core = require('@actions/core');
const github = require('@actions/github');
const { Octokit } = require("@octokit/rest");

const octokit = new Octokit({ auth: core.getInput("github-token"), baseUrl: 'https://api.github.com' });
const payload = github.context.payload;

const pullRequest = payload.pull_request;
const owner = pullRequest.base.repo.owner.login;
const repo = pullRequest.base.repo.name;
const milestone = pullRequest.milestone;

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const workRegexp = /^\[[^\]]+\]/;
const workUrlRegexp = new RegExp(escapeRegExp(core.getInput("work-tracker-host")) + "/[^\\s]*");

async function updateMilestone() {
  const oldDescription = milestone.description;
  const prTitle = pullRequest.title;
  const prDescription = pullRequest.body;
  const workId = workRegexp.exec(prTitle)[0];
  const title = prTitle.split(workId)[1].trim();
  const workUrl = workUrlRegexp.exec(prDescription)[0];
  const newDescription = (oldDescription || "") + "\n- [" + workId + "](" + workUrl + ") " + title + " [#" + pullRequest.number + "](" + pullRequest.html_url + ")";

  const resp = await octokit.issues.updateMilestone({
    owner: owner,
    repo: repo,
    milestone_number: milestone.number,
    description: newDescription
  });

  if (resp.status === 200) {
    console.log('Updated Milestone ' + milestone.title + '!');
  } else {
    console.error('Failed to Update Milestone ' + milestone.title + '. GitHub API returned Status Code: ' + resp.status);
    console.error(resp);
    process.exit(1);
  }
}

try {
  if (pullRequest.merged) {
    updateMilestone();
  }
} catch (error) {
  core.setFailed(error.message);
}
