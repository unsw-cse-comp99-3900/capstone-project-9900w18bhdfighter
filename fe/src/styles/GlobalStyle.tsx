import { createGlobalStyle } from 'styled-components'

export default createGlobalStyle`
  * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
  html,
  body,
  #root,
  .App {
    height: 100%; 
  }
 
  ol,
  ul,
  li {
    list-style: none;
  }

  button {
    cursor: pointer;
  }
`
