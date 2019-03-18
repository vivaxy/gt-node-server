/**
 * @since 2019-03-18 15:35:25
 * @author vivaxy
 */

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
      throw new Error('Unexpected type: ' + this.type);
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
    throw new Error('Unexpected error');
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

function createMatchRoutes(actions) {
  let root = new PathNode({ type: PATH_NODE_TYPE.ROOT });

  function mapActionToNode(actionPath) {
    let prevNode = root;

    function addSectionToNode(section) {
      if (!section) {
        return;
      }
      const type = section.startsWith(':')
        ? PATH_NODE_TYPE.PARAM
        : PATH_NODE_TYPE.TEXT;
      const value = section.startsWith(':') ? section.slice(1) : section;
      const child = new PathNode({
        type,
        value,
        parentPath: prevNode.path,
      });
      prevNode.addChild(child);
      prevNode = child;
    }

    const sections = actionPath.split('/');
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
    const sections = requestPath.split('/');
    sections.forEach((section) => {
      if (!section) {
        return;
      }
      possibleNodesWithParams = getNextPossibleNodesWithParams(
        section,
        possibleNodesWithParams
      );
      if (possibleNodesWithParams.length === 0) {
        throw new Error('Cannot find action path');
      }
    });

    if (possibleNodesWithParams.length !== 1) {
      throw new Error('Error find action path');
    }

    return {
      actionPath: possibleNodesWithParams[0].node.path,
      params: possibleNodesWithParams[0].params,
    };
  }

  return findActionPath;
}

module.exports = createMatchRoutes;
