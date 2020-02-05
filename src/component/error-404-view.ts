import { html, customElement } from 'lit-element';
import { PageViewElement } from './page-view-element';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles';

@customElement('error-404-view')
export class Error404View extends PageViewElement {
  static get styles() {
    return [
      SharedStyles
    ];
  }

  protected render() {
    return html`
      <section>
        <h2>Ojdå! Det gick inte så bra.</h2>
        <p>Sidan som du letar efter verkar inte finnas.</p>
      </section>
    `
  }
}
