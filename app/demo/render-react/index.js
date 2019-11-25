/**
 * @since 2019-11-25 11:38
 * @author vivaxy
 */
import React, { Component } from 'react';

export default class RenderReactApp extends Component {
  state = {
    text: 'Click me!',
  };

  handleClick = () => {
    this.setState(
      {
        text: 'Clicked',
      },
      () => {
        setTimeout(() => {
          this.setState({
            text: 'Click me!',
          });
        }, 1000);
      }
    );
  };

  render() {
    return (
      <div className="render-react-root" onClick={this.handleClick}>
        {this.state.text}
      </div>
    );
  }
}
