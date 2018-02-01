import autobind from 'autobind-decorator';
import React, {Component} from 'react';

import {checkoutBranch, formatBranches} from '../util/git-utils';

class SelectableList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      branches: []
    };

    this.getBranchItems();
  }

  getBranchItems() {
    return formatBranches().then(
      branches => this.setState({branches})
    );
  }

  @autobind
  handleSelect(val, key) {
    checkoutBranch(this.state.branches[key].refname);

    return process.exit(0);
  }

  render() {
    return (
      <list
        border={{type: 'line'}}
        height='90%'
        interactive={true}
        items={this.state.branches.map(branches => branches.text)}
        left='0'
        keys={true}
        mouse={true}
        onSelect={this.handleSelect}
        style={{selected: {bg: '#FFFFFF', fg: '#000000'}}}
        top='0'
        vi={true}
        width='90%'
        />
    );
  }
}

export default SelectableList;
