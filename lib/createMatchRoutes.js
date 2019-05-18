/**
 * @since 2019-03-18 15:35:25
 * @author vivaxy
 */

const errors = require('../conf/errors.js');

const PATH_NODE_TYPE = {
  ROOT: 'ROOT',
  TEXT: 'TEXT',
  PARAM: 'PARAM',
};

class PathNode {
  constructor({ type, value = '', parentPath = '' }) {
    this.type = type;
    this.value = value;
    if (this.type === PATH_NODE_TYPE.ROOT) {
      this.path = '';
    } else if (this.type === PATH_NODE_TYPE.PARAM) {
      this.path = parentPath + '/:' + value;
    } else if (this.type === PATH_NODE_TYPE.TEXT) {
      this.path = parentPath + '/' + value;
    } else {
      throw new Error(errors.$UNEXPECTED_PATH_NODE_TYPE(this.type));
    }
    this.children = [];
  }

  addChild(child) {
    this.children.push(child);
  }
}

function getNextPossibleNodesWithParams(section, nodesWithParams) {
  let nextPossibleNodesWithParams = [];

  function matches(section, node) {
    if (node.type === PATH_NODE_TYPE.TEXT) {
      return {
        match: section === node.value,
        params: {},
      };
    }
    if (node.type === PATH_NODE_TYPE.PARAM) {
      return {
        match: true,
        params: {
          [node.value]: section,
        },
      };
    }
    throw new Error(errors.UNEXPECTED_ERROR);
  }

  nodesWithParams.forEach(({ node, params }) => {
    node.children.forEach((childNode) => {
      const match = matches(section, childNode);
      if (match.match) {
        Object.assign(params, match.params);
        nextPossibleNodesWithParams.push({
          node: childNode,
          params,
        });
      }
    });
  });

  return nextPossibleNodesWithParams;
}

function findMatchNodes(nodes, test) {
  let results = [];
  nodes.forEach((node) => {
    if (test(node)) {
      results.push(node);
    }
  });
  return results;
}

function createMatchRoutes(actions) {
  let root = new PathNode({ type: PATH_NODE_TYPE.ROOT });

  function mapActionToNode(actionPath, index, _sections) {
    let prevNode = root;

    function addSectionToNode(section) {
      if (!section) {
        return;
      }
      const type = section.startsWith(':')
        ? PATH_NODE_TYPE.PARAM
        : PATH_NODE_TYPE.TEXT;
      const value = section.startsWith(':') ? section.slice(1) : section;
      const sameNodes = findMatchNodes(prevNode.children, (node) => {
        return node.value === value && node.type === type;
      });
      if (sameNodes.length === 0) {
        const child = new PathNode({
          type,
          value,
          parentPath: prevNode.path,
          hasAction: _sections.length === index - 1,
        });
        prevNode.addChild(child);
        prevNode = child;
      } else if (sameNodes.length === 1) {
        prevNode = sameNodes[0];
      } else {
        throw new Error(errors.DUPLICATED_NODES);
      }
    }

    const sections = actionPath.split('/');
    // should mark the last one with `hasAction = true`
    sections.forEach(addSectionToNode);
  }

  actions.forEach(mapActionToNode);

  function findActionPath(requestPath) {
    function mapNodeWithParams(node) {
      return {
        node,
        params: {},
      };
    }

    let possibleNodesWithParams = [mapNodeWithParams(root)];
    const getPathSections = require('./getPathSections.js');
    const sections = getPathSections(requestPath);
    if (sections.length === 0) {
      // request /
      // todo response with actions/index.js
    }
    sections.forEach((section) => {
      if (!section) {
        return;
      }
      possibleNodesWithParams = getNextPossibleNodesWithParams(
        section,
        possibleNodesWithParams
      );
      if (possibleNodesWithParams.length === 0) {
        throw new Error(errors.CANNOT_FIND_ACTION_PATH);
      }
    });

    if (possibleNodesWithParams.length !== 1) {
      throw new Error(errors.CANNOT_FIND_ACTION_PATH);
    }

    return {
      actionPath: possibleNodesWithParams[0].node.path,
      params: possibleNodesWithParams[0].params,
    };
  }

  return findActionPath;
}

module.exports = createMatchRoutes;
