import { spawn } from 'child_process';
import { split } from 'lodash';

function git(...args) {
  return new Promise((resolve, reject) => {
    const child = spawn('git', args);

    child.stdout.on('data', (data = '') => resolve(data.toString()));
    child.stderr.on('data', (stderr = '') => reject(stderr.toString()));
    child.stderr.on('end', (data = '') => resolve(data.toString()));
  });
}

export function checkoutBranch(branch) {
  return git('checkout', branch);
}

export function gitStatus() {
  return git('status', '--short');
}

export function getGitBranches() {
  return git(
    'for-each-ref',
    '--shell',
    '--sort=-committerdate',
    '--format=refname: %(refname), objectname: %(objectname:short), authorname: %(authorname), commitdate: %(committerdate:relative), subject: %(subject)',
    'refs/heads'
  );
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

    return formatBranch(retObj);
  });

  return retVal;
}

export function fetchBranches() {
  return getGitBranches().then(data => {
    const branches = split(data, '\n').filter(branch => branch !== '');

    return createBranchObject(branches);
  });
}
export function formatBranch(branch) {
  const { authorname, commitdate, objectname, refname, subject } = branch;

  return [refname, objectname, `${subject} (${commitdate}) - ${authorname}`];
}
