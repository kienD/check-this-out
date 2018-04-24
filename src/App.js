import blessed from 'blessed';

import { checkoutBranch, fetchBranches } from './util/git-utils';

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
  height: '90%',
  keys: true,
  mouse: true,
  noCellBorders: true,
  pad: 1,
  style: {
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

fetchBranches().then(branches => {
  recentTable.setLabel('Most Recent Branches');

  recentTable.setData([
    ['Branch', 'SHA', 'Lastest Commit'],
    ...branches
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
