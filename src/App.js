import blessed from 'blessed';

import { checkoutBranch, formatBranches } from './util/git-utils';

const screen = blessed.screen({
  autoPadding: true,
  debug: true,
  fullUnicode: true,
  smartCSR: true,
  title: 'Check This Out',
  warnings: true
});

const recentTable = blessed.listtable({
  align: 'left',
  border: { type: 'line' },
  height: '90%',
  keys: true,
  mouse: true,
  noCellBorders: true,
  pad: 1,
  style: {
    border: { fg: '#66D9EF' },
    cell: {
      selected: {
        bg: '#FFFFFF',
        fg: '#000000'
      }
    },
    header: {
      fg: '#66D9EF'
    },
    label: {
      fg: '#66D9EF'
    }
  },
  tags: true,
  top: 1,
  vi: true,
  width: 'shrink'
});

recentTable.focus();

formatBranches().then(branches => {
  const formattedBranches = branches.map(
    ({ authorname, commitdate, objectname, refname, subject }) => {
      return [
        `{red-fg}{bold}${refname}{/}`,
        objectname,
        `${subject} (${authorname})`
      ];
    }
  );

  recentTable.setLabel('Recently Checkout Branches');

  recentTable.setData([
    ['Branch', 'SHA', 'Lastest Commit'],
    ...formattedBranches
  ]);

  screen.render();
});

recentTable.on('select', (val, key) => {
  const selectedBranch = val.content.trim().split(' ')[0];

  checkoutBranch(selectedBranch);

  return process.exit(0);
});

screen.key(['escape', 'q', 'C-c'], (ch, key) => process.exit(0));

screen.append(recentTable);

screen.render();
