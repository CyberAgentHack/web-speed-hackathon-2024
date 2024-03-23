import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';

import { Color } from './variables';

export const GlobalStyle = createGlobalStyle`
  ${reset}

  body {
    background-color: ${Color.MONO_A};
  }

  a {
    text-decoration: none;
  }
`;
