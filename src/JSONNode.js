import React, { PropTypes } from 'react';
import objType from './objType';
import JSONObjectNode from './JSONObjectNode';
import JSONArrayNode from './JSONArrayNode';
import JSONIterableNode from './JSONIterableNode';
import JSONValueNode from './JSONValueNode';

const typeMap = {
  Object: props => <JSONObjectNode {...props} />,
  Error: props => <JSONObjectNode {...props} />,
  WeakMap: props => <JSONObjectNode {...props} />,
  WeakSet: props => <JSONObjectNode {...props} />,

  Array: props => <JSONArrayNode {...props} />,

  Iterable: props => <JSONIterableNode {...props} />,
  Map: props => <JSONIterableNode {...props} />,
  Set: props => <JSONIterableNode {...props} />,

  Number: props => <JSONValueNode {...props} />,
  Custom: props => <JSONValueNode {...props} />,

  String: props => <JSONValueNode {...props} valueGetter={raw => `"${raw}"`} />,
  Boolean: props => <JSONValueNode {...props} valueGetter={raw => (raw ? 'true' : 'false')} />,
  Date: props => <JSONValueNode {...props} valueGetter={raw => raw.toISOString()} />,
  Null: props => <JSONValueNode {...props} valueGetter={() => 'null'} />,
  Undefined: props => <JSONValueNode {...props} valueGetter={() => 'undefined'} />,

  Function: props => <JSONValueNode {...props} valueGetter={raw => raw.toString()} />,
  Symbol: props => <JSONValueNode {...props} valueGetter={raw => raw.toString()} />
};

const nestedTypes = {
  Object: true,
  Error: true,
  WeakMap: true,
  WeakSet: true,
  Array: true,
  Iterable: true,
  Map: true,
  Set: true
};

const JSONNode = ({
  getItemString,
  keyPath,
  labelRenderer,
  styling,
  value,
  valueRenderer,
  isCustomNode,
  onChange,
  ...rest
}) => {
  const nodeType = isCustomNode(value) ? 'Custom' : objType(value);

  const simpleNodeProps = {
    getItemString,
    key: keyPath[0],
    keyPath,
    labelRenderer,
    nodeType,
    styling,
    value,
    valueRenderer,
    onChange,
  };

  const nestedNodeProps = {
    ...rest,
    ...simpleNodeProps,
    data: value,
    isCustomNode,
    onChange,
  };

  const handler = typeMap[nodeType];
  if (!handler) { return null; }

  const isNested = nestedTypes[nodeType];
  return handler(isNested ? nestedNodeProps : simpleNodeProps);
};

JSONNode.propTypes = {
  getItemString: PropTypes.func.isRequired,
  keyPath: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])).isRequired,
  labelRenderer: PropTypes.func.isRequired,
  styling: PropTypes.func.isRequired,
  value: PropTypes.any,
  valueRenderer: PropTypes.func.isRequired,
  isCustomNode: PropTypes.func.isRequired,
  onChange: PropTypes.func,
};

export default JSONNode;

