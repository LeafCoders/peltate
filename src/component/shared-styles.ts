import { css } from 'lit-element';

export const SharedStyles = css`
  :host {
    display: block;
    box-sizing: border-box;
    padding: 0 4px 4px 4px;
  }
  h2 {
    font-size: 24px;
    text-align: center;
    color: var(--app-dark-text-color);
  }

  @media (min-width: 770px) {
    :host {
      padding: 0 24px 24px 24px;
    }
    h2 {
      font-size: 36px;
    }
    section {
      max-width: 720px;
      margin-right: auto;
      margin-left: auto;
    }
  }

  @media (min-width: 1020px) {
    section {
      max-width: 960px;
      margin-right: auto;
      margin-left: auto;
    }
  }
`;
