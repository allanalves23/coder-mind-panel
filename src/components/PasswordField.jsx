import React, { useState } from 'react';
import PropTypes from 'prop-types';

import {
  TextField,
  InputAdornment,
  IconButton,
  Icon,
} from '@material-ui/core';

function PasswordField(props) {
  const {
    label,
    onChange,
    inputId,
    inputAutoComplete,
    fullWidth,
    autoFocus,
    value,
    margin,
    variant,
    size,
  } = props;

  const [visible, setVisible] = useState(false);

  function toogleVisibility() {
    setVisible(!visible);
  }

  return (
    <TextField
      label={label}
      onChange={onChange}
      fullWidth={fullWidth}
      autoFocus={autoFocus}
      variant={variant}
      size={size}
      value={value}
      type={visible ? 'text' : 'password'}
      margin={margin}
      InputProps={{
        autoComplete: inputAutoComplete,
        id: inputId,
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={toogleVisibility} size="small">
              <Icon>{!visible ? 'visibility_off' : 'visibility'}</Icon>
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}

PasswordField.propTypes = {
  label: PropTypes.string,
  onChange: PropTypes.func,
  inputId: PropTypes.string,
  inputAutoComplete: PropTypes.string,
  fullWidth: PropTypes.bool,
  autoFocus: PropTypes.bool,
  value: PropTypes.string,
  margin: PropTypes.oneOf([
    'dense',
    'none',
    'normal',
  ]),
  size: PropTypes.oneOf([
    'small',
    'medium',
  ]),
  variant: PropTypes.oneOf([
    'filled',
    'outlined',
    'standard',
  ]),
};

PasswordField.defaultProps = {
  label: '',
  onChange: null,
  inputId: '',
  inputAutoComplete: 'PropTypes.string',
  fullWidth: false,
  autoFocus: false,
  value: '',
  margin: 'none',
  variant: 'standard',
  size: 'medium',
};

export default PasswordField;
