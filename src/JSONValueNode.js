import React from 'react';
import PropTypes from 'prop-types';

/**
 * Renders simple values (eg. strings, numbers, booleans, etc)
 */

const replaces = {
  null: null,
  true: true,
  false: false,
  undefined,
};

const transformString = (value) => {
  const replaced = Object.prototype.hasOwnProperty.call(replaces, value) ? replaces[value] : value;
  return !isNaN(parseFloat(replaced)) && isFinite(replaced) ? Number(replaced) : replaced;
};

const getString = ({ value, nodeType, valueGetter }) => {
  if (nodeType === 'String') { return value; }
  return valueGetter(value);
};

export default class JSONValueNode extends React.Component {
  static propTypes = {
    nodeType: PropTypes.string.isRequired,
    styling: PropTypes.func.isRequired,
    labelRenderer: PropTypes.func.isRequired,
    keyPath: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])).isRequired,
    valueRenderer: PropTypes.func.isRequired,
    value: PropTypes.any,
    valueGetter: PropTypes.func,
    onChange: PropTypes.func.isRequired,
  };

  static defaultProps = {
    valueGetter: value => value,
  };

  static getDerivedStateFromProps(props, state) {
    // If the props value changes and we're not currently editing,
    // it should be reflected in this component.
    if (props.value !== state.lastValue && !state.editing) {
      const value = getString(props);
      return {
        value,
        lastValue: value,
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      value: getString(props),
      lastValue: getString(props), // For gDSFP
      editing: false,
    };
  }

  keydown = (e) => {
    // Echap, remove edit mode and reset value
    if (e.keyCode === 27) {
      this.setState({ editing: false, value: getString(this.props) });
    }

    // If it's not enter, do nothing
    if (e.keyCode !== 13) { return; }

    const { onChange, keyPath } = this.props;
    const { value } = this.state;

    onChange({ keyPath, value: transformString(value) });
    this.setState({ editing: false });
  }

  updateValue = e => this.setState({ value: e.target.value })
  toggleEdit = () => this.setState({ editing: !this.state.editing })

  render() {
    const {
      nodeType,
      styling,
      labelRenderer,
      keyPath,
      valueRenderer,
      valueGetter,
    } = this.props;

    const { value, editing } = this.state;
    const isEditable = ['Null', 'Undefined', 'String', 'Number', 'Boolean'].includes(nodeType);

    return (
      <li
        {...styling('value', nodeType, keyPath)}
      >
        <label {...styling(['label', 'valueLabel'], nodeType, keyPath)}>
          {labelRenderer(keyPath, nodeType, false, false)}
        </label>
        {editing ? (
          <input
            onChange={this.updateValue}
            onKeyDown={this.keydown}
            style={{
              ...styling('valueText', nodeType, keyPath).style,
              width: '100%',
              overflow: 'hidden'
            }}
            value={value}
            type='text'
            autoFocus
          />
        ) : (
          <span
            onClick={isEditable && this.toggleEdit}
            {...styling('valueText', nodeType, keyPath)}
          >
            {valueRenderer(valueGetter(this.props.value), value, ...keyPath)}
          </span>
        )}
      </li>
    );
  }
}
