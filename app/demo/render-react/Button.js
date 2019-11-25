/**
 * @since 2019-11-25 08:22
 * @author vivaxy
 */
import { connect } from 'react-redux';
import React, { Component } from 'react';

import { click, reset } from './actions';

import './index.css';

class Button extends Component {
  handleClick = () => {
    this.props.click();
    setTimeout(() => {
      this.props.reset();
    }, 1000);
  };

  render() {
    return (
      <div className="render-react-root" onClick={this.handleClick}>
        {this.props.text}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    text: state.text,
  };
};

const mapDispatchToProps = { click, reset };

export default connect(mapStateToProps, mapDispatchToProps)(Button);
