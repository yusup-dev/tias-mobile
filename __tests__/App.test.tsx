/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../App';

// Note: import explicitly to use the types shipped with jest.
import {it, jest} from '@jest/globals';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

jest.mock('../src/navigation/navigate', () => {
  return function MockedNavigation() {
    return null;
  };
});

it('renders correctly', () => {
  renderer.create(<App />);
});
