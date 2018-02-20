import blessed from 'blessed';
import contrib from 'blessed-contrib';

import {checkoutBranch, formatBranches} from './util/git-utils';

// import React, {Component} from 'react';
// import {render} from 'react-blessed';

// import SelectableList from './components/SelectableList';

// class App extends Component {
//   render() {
//     return <SelectableList />;
//   }
// }

const screen = blessed.screen({
  autoPadding: true,
  smartCSR: true,
  title: 'Check This Out'
});

const recentTable = contrib.table({
  border: {type: 'line'},
  columnWidth: [20, 10 , 70],
  height: '90%',
  interactive: true,
  keys: true,
  label: 'Recently Checked Out Branches',
  mouse: true,
  ref: 'list',
  style: {
    border: {fg: '#66D9EF'},
    selected: {
      bg: '#FFFFFF',
      fg: '#000000'
    }
  },
  top: 1,
  vi: true,
  width: '90%'
});

recentTable.focus();

formatBranches().then(
  branches => {
    const formattedBranches = branches.map(
      ({authorname, commitdate,  objectname, refname, subject}) => {
        return [refname, objectname, subject];
      }
    );

    recentTable.setData({
      headers: ['Branch', 'SHA', 'Last Commit'],
      data: formattedBranches
    });

    screen.render();
  }
);

recentTable.on('enter', (val, key) => {
  console.log(val + key)
  // recentTable.setLabel({text: 'stuff'})
  // screen.render();

  // checkoutBranch(this.state.branches[key].refname);

  return process.exit(0);
});

screen.key(['escape', 'q', 'C-c'], (ch, key) => process.exit(0));

screen.append(recentTable);

screen.render();

// render (<App />, screen);
