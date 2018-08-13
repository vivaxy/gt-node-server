import React, { Component } from 'react';

import httpStatusCodes from '../conf/httpStatusCodes';
import httpMethods from '../conf/httpMethods';
import Action from '../lib/Action';
import ArgTypes from '../lib/ArgTypes';

class LifeCircle extends Component {
  constructor(props) {
    super(props);
    this.logger = (message) => {
      console.log('LifeCircle:', message);
    };
    this.logger('constructor');
  }

  componentWillMount() {
    this.logger('componentWillMount');
  }

  componentDidMount() {
    this.logger('componentDidMount');
  }

  componentWillReceiveProps() {
    this.logger('componentWillReceiveProps');
  }

  shouldComponentUpdate() {
    this.logger('shouldComponentUpdate');
  }

  componentWillUpdate() {
    this.logger('componentWillUpdate');
  }

  componentDidUpdate() {
    this.logger('componentDidUpdate');
  }

  componentWillUnmount() {
    this.logger('componentWillUnmount');
  }

  render() {
    this.logger('render');
    return 'LifeCircle';
  }
}

export default class extends Action {
  constructor(ctx) {
    super(ctx);
    this.argTypes = {
      name: ArgTypes.string.isRequired,
      age: ArgTypes.number,
    };
    this.defaultArgs = {
      age: 18,
    };
  }

  get(args) {
    this.setStatus(httpStatusCodes.OK);
    this.render(LifeCircle);
  }
}
