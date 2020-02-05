import { html, css, customElement } from 'lit-element';
import { PageViewElement } from './page-view-element';
import { SharedStyles } from './shared-styles';
import './article-block';
import { Article } from '../model/article';
import { apiGetArticles, apiGetArticlesMore } from '../controller/rosette-api';

@customElement('articles-view')
export class ArticlesView extends PageViewElement {
  static get styles() {
    return [
      SharedStyles,
      css`
        article-block {
          flex: 1 1 50%;
          max-width: 50%;
        }

        button {
          margin: 6px;
          padding: 8px 32px;
          font-size: 16px;
          color: #494949 !important;
          background-color: #fcfcfc;
          border: none;
          border-radius: 6px;
          overflow: hidden;
          box-shadow: 0 0 0 transparent;
          transition: box-shadow 0.5s;
        }

        button:hover {
          cursor: pointer;
          box-shadow: 0 0 8px #aaa;
        }

        div[hide], button[hide] {
          visibility: hidden;
        }

        @media (min-width: 770px) {
          article-block {
            flex: 0 0 240px;
            max-width: 240px;
          }
        }
      `
    ];
  }

  private articles: Array<Article> = [];
  private hasLoaded: boolean = false;
  private loading: boolean = true;
  private scrollObserver: IntersectionObserver | null = null

  private async loadIt() {
    if (this.hasLoaded) {
      return;
    }
    this.hasLoaded = true;
    this.articles = await apiGetArticles(1);
    this.loading = false;
    this.requestUpdate();
  }

  private async loadMore() {
    this.loading = true;
    this.requestUpdate();
    this.articles = await apiGetArticlesMore();
    this.loading = false;
    this.requestUpdate();
  }

  protected render() {
    this.loadIt();
    return html`
      <section>
        <h2>Predikningar</h2>
        <div style="display: flex; flex-wrap: wrap; align-items: flex-end;">
        ${this.articles.map(a => {
          return html`<article-block .article="${a}"></article-block>`
        })}
        </div>
      </section>
      <section style="text-align: center">
        <button ?hide="${this.loading || this.articles.length == 0}" @click="${this.loadMore}">Hämta fler</button>
        <div ?hide="${!this.loading}">
          <svg width="120" height="30" viewBox="0 0 120 30" xmlns="http://www.w3.org/2000/svg" fill="#fff">
            <circle cx="15" cy="15" r="15">
              <animate attributeName="r" from="15" to="15" begin="0s" dur="0.8s" values="15;9;15" calcMode="linear" repeatCount="indefinite" />
              <animate attributeName="fill-opacity" from="1" to="1" begin="0s" dur="0.8s" values="1;.5;1" calcMode="linear" repeatCount="indefinite" />
            </circle>
            <circle cx="60" cy="15" r="9" fill-opacity="0.3">
              <animate attributeName="r" from="9" to="9" begin="0s" dur="0.8s" values="9;15;9" calcMode="linear" repeatCount="indefinite" />
              <animate attributeName="fill-opacity" from="0.5" to="0.5" begin="0s" dur="0.8s" values=".5;1;.5" calcMode="linear" repeatCount="indefinite" />
            </circle>
            <circle cx="105" cy="15" r="15">
              <animate attributeName="r" from="15" to="15" begin="0s" dur="0.8s" values="15;9;15" calcMode="linear" repeatCount="indefinite" />
              <animate attributeName="fill-opacity" from="1" to="1" begin="0s" dur="0.8s" values="1;.5;1" calcMode="linear" repeatCount="indefinite" />
            </circle>
          </svg>
        </div>
      </section>
    `;
  }

  protected firstUpdated() {
    this.scrollObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadMore();
        }
      });
    }, { rootMargin: "0px 0px 800px 0px" });
    if (this.scrollObserver && this.shadowRoot) {
      let button = this.shadowRoot.querySelector("button")
      if (button) {
        this.scrollObserver.observe(button);
      }
    }
  }  
}
