import blessed from 'blessed';

import { checkoutBranch, fetchBranches, gitStatus } from './util/git-utils';

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

var msg = blessed.message({
  parent: screen,
  border: 'line',
  height: 'shrink',
  width: 'half',
  top: 'center',
  left: 'center',
  label: ' {blue-fg}Message{/blue-fg} ',
  tags: true,
  keys: true,
  hidden: true,
  vi: true
});

gitStatus().then(status => {
  if (status) {
    msg.display(
      `You have the following uncommited changes:\n ${status}`,
      0,
      () => process.exit(0)
    );
  } else {
    recentTable.focus();

    screen.render();

    fetchBranches().then(branches => {
      recentTable.setLabel('Most Recent Branches');

      recentTable.setData([['Branch', 'SHA', 'Lastest Commit'], ...branches]);

      screen.render();
    });
  }
});

recentTable.on('select', (val, key) => {
  const selectedBranch = val.content.trim().split(' ')[0];

  checkoutBranch(selectedBranch).then(() => process.exit(0));
});

screen.key(['escape', 'q', 'C-c'], (ch, key) => process.exit(0));

screen.append(recentTable);

screen.render();
