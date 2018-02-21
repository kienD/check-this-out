import { exec } from 'child_process';
import { split } from 'lodash';

export function checkoutBranch(branch) {
  exec(`git checkout ${branch}`);
}

export function getGitBranches() {
  let retVal;

  return new Promise((resolve, reject) => {
    exec(
      `git for-each-ref --shell --sort=-committerdate --format="refname: %(refname), objectname: %(objectname:short), authorname: %(authorname), commitdate: %(committerdate:relative), subject: %(subject)" "refs/heads"`,
      (error, stdout, stderr) => {
        if (error) {
          reject(stderr);
        } else {
          resolve(stdout);
        }

        return stdout;
      }
    );
  });
}

function createBranchObject(branch) {
  const commitSplit = branch.map(keyValuePairs => split(keyValuePairs, ','));

  const retVal = commitSplit.map(commit => {
    let retObj = {};

    commit.map(val => {
      const splitVal = split(val, ': ');

      if (splitVal[1]) {
        retObj[splitVal[0].trim()] = splitVal[1].slice(1, -1).trim();
      }
    });

    retObj.refname = retObj.refname
      .substr(retObj.refname.lastIndexOf('/') + 1)
      .trim();

    retObj.text = `${retObj.refname} - ${retObj.objectname} (${
      retObj.authorname
    }) ${retObj.subject}`;

    return retObj;
  });

  return retVal;
}

export function formatBranches() {
  return getGitBranches().then(data => {
    const commits = split(data, '\n').filter(commit => commit !== '');

    let retVal = createBranchObject(commits);

    return retVal;
  });
}

formatBranches();
