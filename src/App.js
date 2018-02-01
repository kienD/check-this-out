import blessed from 'blessed';
import React, {Component} from 'react';
import {render} from 'react-blessed';

import SelectableList from './components/SelectableList';

class App extends Component {
  render() {
    return (
      <SelectableList />
    );
  }
}

const screen = blessed.screen({
  autoPadding: true,
  smartCSR: true,
  title: 'Git Switch'
});

screen.key(['escape', 'q', 'C-c'], (ch, key) => process.exit(0));

render (<App />, screen)

// add minifier
