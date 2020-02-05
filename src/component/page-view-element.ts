import { LitElement, property } from 'lit-element';

export class PageViewElement extends LitElement {

  protected shouldUpdate() {
    return this.active;
  }

  @property({type: Boolean})
  protected active = false;
}
