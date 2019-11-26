/**
 * @since 2019-11-26 10:32
 * @author vivaxy
 */
import { connect } from 'react-redux';
import React, { Component } from 'react';

import fetch from '../../../lib/fetch';
import { fetchStart } from './actions';

class Fetch extends Component {
  static async getInitialProps(ctx) {
    const {} = await fetch({ req: ctx.req, path: '/demo/render-react-id' });
  }

  componentDidMount() {
    this.props.fetchStart();
  }

  render() {
    return <p>{this.props.fetchedData}</p>;
  }
}

function mapStateToProps(state) {
  return {
    fetchedData: state.fetchedData,
  };
}

const mapDispatchToProps = { fetchStart };

export default connect(mapStateToProps, mapDispatchToProps, Fetch);
