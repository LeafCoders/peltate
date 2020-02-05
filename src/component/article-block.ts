import { LitElement, html, css, property, customElement } from 'lit-element';
import { Article, ArticleAuthor, articleThumbImageUrl } from '../model/article';
import { textIcon, audioIcon } from './app-icons';

@customElement('article-block')
export class ArticleBlock extends LitElement {
  @property({type: Object})
  article: Article = { slug: "", title: "", time: "" };

  static get styles() {
    return [
      css`
        :host {
          display: block;
          height: 100%;
          font-size: 16px;
          color: #333;
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          -khtml-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
        .container {
          margin: 6px;
          background-color: #fcfcfc;
          border-radius: 6px;
          overflow: hidden;
          box-shadow: 0 0 0 transparent;
          transition: box-shadow 0.5s;
        }
        .container:hover {
          cursor: pointer;
          box-shadow: 0 0 8px #aaa;
        }
        img {
          width: calc(100% - 8px);
          margin: 4px 4px 0 4px;
          border-radius: 4px 4px 0 0;
        }
        .title {
          font-weight: bold;
        }
        .small {
          font-size: 14px;
          color: #777;
        }
        a {
          display: inline-block;
          width: 100%;
          text-decoration: none;
          color: #333;
        }
      `
    ];
  }

  protected render() {
    return html`
      <a href="${this.article.slug}">
        <div class="container">
          <div style="min-height: 124px;">
            <img .src="${articleThumbImageUrl(this.article)}">
          </div>
          <div style="padding: 0 8px 8px 8px; height: 200px; max-height: 150px; overflow: hidden; overflow-wrap: break-word;">
            <div class="small">
              ${this.formatTime(this.article.time)}
              <div ?hidden="${!this.article.content}" style="float: right; color: lightgray; fill: lightgray;">${textIcon}</div>
              <div ?hidden="${!this.article.recordingUrl}" style="float: right; color: lightgray; fill: lightgray;">${audioIcon}</div>
            </div>
            <div class="title">${this.article.title}</div>
            <div>${this.authors(this.article.authors)}</div>
          </div>
        </div>
      </a>
    `;
  }

  private formatTime(time?: string): string {
    if (!time) {
      return '';
    }
    const year: number = Number.parseInt(time.substr(0, 4), 10);
    const month: string = ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'][Number.parseInt(time.substr(5, 2), 10) - 1];
    const day: number = Number.parseInt(time.substr(8, 2), 10);
    if (new Date().getFullYear() !== year) {
      return `${day} ${month} ${year}`;
    }
    return `${day} ${month}`;
  }

  private authors(authors?: Array<ArticleAuthor>): string {
    return authors ? authors.map(a => a.name).join(', ') : ''    
  }

}
