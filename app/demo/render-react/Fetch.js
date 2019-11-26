/**
 * @since 2019-11-26 10:32
 * @author vivaxy
 */
import { connect } from 'react-redux';
import React, { Component } from 'react';

import { setFetchedData } from './actions';

class Fetch extends Component {
  render() {
    return <p>{JSON.stringify(this.props.fetchedData)}</p>;
  }
}

function mapStateToProps(state) {
  return {
    fetchedData: state.fetchedData,
  };
}

const mapDispatchToProps = { setFetchedData };

export default connect(mapStateToProps, mapDispatchToProps)(Fetch);
