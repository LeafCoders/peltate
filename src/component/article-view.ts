import { html, css, property, customElement } from 'lit-element';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import { Article, ArticleAuthor, articleImageUrl } from '../model/article';
import { talkIcon, serieIcon, timeIcon } from './app-icons';
import { PageViewElement } from './page-view-element';

@customElement('article-view')
export class ArticleView extends PageViewElement {

  @property({type: Object})
  private article: Article = { slug: "", title: "", time: "" };

  static get styles() {
    return [
      css`
        :host {
          display: block;
          height: 100%;
          font-size: 16px;
          color: #333;
          background-color: #fcfcfc;
        }
        .wrapper {
          display: flex;
          flex-direction: column;
          padding: 32px 16px;
        }
        .side-container {
          flex: 1 0 auto;
          text-align: center;
        }
        img {
          width: 75%;
          margin-bottom: 24px;
        }
        .container-spacer {
          width: 96px;
          height: 0px;
        }
        article {
          flex: 1 0 auto;
        }
        .title {
          font-weight: bold;
          font-size: 24px
        }
        .small {
          font-size: 14px;
          color: #777;
        }
        h2 {
          font-size: 18px;
        }
        .icon-row {
          display: flex;
        }
        .icon-row > div {
          margin-right: 8px;
          color: #555;
          fill: #555;
        }

        @media (min-width: 770px) {
          .wrapper {
            flex-direction: row;
            padding: 32px 64px;
            margin-left: auto;
            margin-right: auto;
            max-width: 1000px;
          }
          .side-container {
            flex: 0 1 460px;
          }
          img {
            width: 100%;
          }
          article {
            flex: 0 1 600px;
          }
        }
      `
    ];
  }

  public attributeChangedCallback(name: string, oldValue: string|null, newValue: string|null) {
    super.attributeChangedCallback(name, oldValue, newValue);

    // Pause audio when leaving page
    if (name === "active" && !this.active && this.shadowRoot) {
      let audioElement: any = this.shadowRoot.querySelector("audio")
      if (audioElement) {
        audioElement.pause();
      }
    }
  }

  protected render() {
    (<any>window).scrollTo(0, 0);
    let audioHtml;
    if (this.article.recordingUrl != undefined) {
      audioHtml = html`<audio .src="${this.article.recordingUrl}" controls preload="metadata" style="width: 100%"></audio><br>`;
    } else if (this.article.expectingRecording) {
      audioHtml = html`<p><em>Ljudinspelningen finns inte tillgänglig än. Återkom igen vid ett senare tillfälle.</em></p>`;
    } else {
      audioHtml = html`<p><em>Ljudinspelning saknas.</em></p>`;
    }
    if (this.article) {
      return html`
        <div class="wrapper">
          <div class="side-container">
            <img .src="${articleImageUrl(this.article)}">
            ${audioHtml}
          </div>
          <div class="container-spacer"></div>
          <article>
            <div class="container">
              <h1>${this.article.title}</h1>
              <div class="icon-row"><div>${serieIcon}</div>${this.article.articleSerieTitle}</div>
              <div class="icon-row"><div>${talkIcon}</div>${this.authors(this.article.authors)}</div>
              <div class="icon-row"><div>${timeIcon}</div>${this.formatTime(this.article.time)}</div>
              <p>${unsafeHTML(this.article.content)}</p>
            </div>
          </article>
        </div>
      `;
    } else {
      return html`Laddar...`;
    }
  }

  private formatTime(time?: string): string {
    if (!time) {
      return '';
    }
    const year: string = time.substr(0, 4);
    const month: string = ['januari', 'februari', 'mars', 'april', 'maj', 'juni', 'juli', 'augusti', 'september', 'oktober', 'november', 'december'][Number.parseInt(time.substr(5, 2), 10) - 1];
    const day: number = Number.parseInt(time.substr(8, 2), 10);
    return `${day} ${month} ${year}`;
  }

  private authors(authors?: Array<ArticleAuthor>): string {
    return authors ? authors.map(a => a.name).join(', ') : ''    
  }
}
