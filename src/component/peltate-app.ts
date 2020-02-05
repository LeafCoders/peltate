import { LitElement, html, css, property, PropertyValues, customElement } from 'lit-element';
import { setPassiveTouchGestures } from '@polymer/polymer/lib/utils/settings';
import { installMediaQueryWatcher } from 'pwa-helpers/media-query';
import { installOfflineWatcher } from 'pwa-helpers/network';
import { installRouter } from 'pwa-helpers/router';
import { updateMetadata, setMetaTag } from 'pwa-helpers/metadata';

import '@polymer/app-layout/app-drawer-layout/app-drawer-layout';
import '@polymer/app-layout/app-drawer/app-drawer';
import '@polymer/app-layout/app-header-layout/app-header-layout';
import '@polymer/app-layout/app-header/app-header';
import '@polymer/app-layout/app-toolbar/app-toolbar';
import '@polymer/app-layout/app-scroll-effects/effects/waterfall';
import { menuIcon, backIcon } from './app-icons';
import './snack-bar';

import { apiGetArticle } from '../controller/rosette-api';
import { loadingArticle } from '../model/data';
import { Article, articleImageUrl } from '../model/article';

@customElement('peltate-app')
export class PeltateApp extends LitElement {
  @property({type: String})
  private appTitle = '';

  @property({type: String})
  private _page = '';

  @property({type: Boolean})
  private _drawerOpened = false;

  @property({type: Boolean})
  private _snackbarOpened = false;

  @property({type: Boolean})
  private _offline = false;

  static get styles() {
    return [
      css`
        :host {
          display: block;

          --app-drawer-width: 256px;

          --app-primary-color: #693;
          --app-secondary-color: #293237;
          --app-dark-text-color: var(--app-secondary-color);
          --app-light-text-color: white;
          --app-section-even-color: #f7f7f7;
          --app-section-odd-color: white;

          --app-header-background-color: white;
          --app-header-text-color: var(--app-dark-text-color);
          --app-header-selected-color: var(--app-primary-color);

          --app-drawer-background-color: var(--app-secondary-color);
          --app-drawer-text-color: var(--app-light-text-color);
          --app-drawer-selected-color: var(--app-primary-color);
        }

        app-header {
          text-align: center;
          background-color: var(--app-header-background-color);
          color: var(--app-header-text-color);
        }
        
        app-toolbar {
          background-color: var(--app-header-background-color);
        }

        .header-image {
          position: absolute;
          left: 64px;
          right: 64px;
          top: 0;
          bottom: 0;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .header-image img {
          position: relative;
          width: 400px;
          max-width: 60vw;
          max-height: 44px;
        }

        .toolbar-list {
          display: none;
        }

        .toolbar-list > a {
          display: inline-block;
          color: var(--app-header-text-color);
          text-decoration: none;
          line-height: 30px;
          padding: 4px 24px;
        }

        .toolbar-list > a[selected] {
          color: var(--app-header-selected-color);
          border-bottom: 4px solid var(--app-header-selected-color);
        }

        .menu-btn {
          background: none;
          border: none;
          fill: var(--app-header-text-color);
          cursor: pointer;
          height: 44px;
          width: 44px;
        }

        .back-btn {
          background: none;
          border: none;
          fill: var(--app-header-text-color);
          cursor: pointer;
          height: 44px;
          width: 44px;
        }

        button[active] {
          display: block;
        }

        button {
          display: none;
        }

        .drawer-list {
          box-sizing: border-box;
          width: 100%;
          height: 100%;
          padding: 24px;
          background: var(--app-drawer-background-color);
          position: relative;
        }

        .drawer-list > a {
          display: block;
          text-decoration: none;
          color: var(--app-drawer-text-color);
          line-height: 40px;
          padding: 0 24px;
        }

        .drawer-list > a[selected] {
          color: var(--app-drawer-selected-color);
        }

        /* Workaround for IE11 displaying <main> as inline */
        main {
          display: block;
        }

        .page {
          display: none;
        }

        .page[active] {
          display: block;
        }

        /* Wide layout: when the viewport width is bigger than 460px, layout
        changes to a wide layout */
        @media (min-width: 460px) {
          .toolbar-list {
            display: block;
          }

          .menu-btn {
            display: none !important;
          }

          /* The drawer button isn't shown in the wide layout, so we don't need to offset the title */
          [main-title] {
            padding-right: 0px;
          }
        }
      `
    ];
  }

  protected render() {
    let menuButton = html``;
    let menuItems = html``;
    if ((<any>window).peltateOptions.showMenu) {
      menuButton = html`<button class="menu-btn" ?active="${this._isListView}" title="Meny" @click="${this._menuButtonClicked}">${menuIcon}</button>`;
      menuItems = html`<a ?selected="${this._page === 'articles'}" href="./">Predikningar</a>`;
    }

    return html`
      <app-drawer-layout force-narrow>
        <app-drawer slot="drawer" .opened="${this._drawerOpened}" @opened-changed="${this._drawerOpenedChanged}">
          <nav class="drawer-list">${menuItems}</nav>
        </app-drawer>

        <app-header-layout>
          <app-header slot="header" condenses reveals effects="waterfall">
            <app-toolbar>
              <div class="header-image">
                <img src="image-templates/peltate-header-400x44.png">
              </div>
              ${menuButton}
              <button class="back-btn" ?active="${!this._isListView}" title="Tillbaka till föregående sida" @click="${this._backButtonClicked}">${backIcon}</button>
            </app-toolbar>
            <nav class="toolbar-list">${menuItems}</nav>
          </app-header>

          <main role="main" class="main-content">
            <articles-view class="page" ?active="${this._page === 'articles'}"></articles-view>
            <article-view class="page" ?active="${this._page === 'article'}" .article="${this._article}"></article-view>
            <error-404-view class="page" ?active="${this._page === 'error404'}"></error-404-view>
          </main>

          <snack-bar ?active="${this._snackbarOpened}">
            You are now ${this._offline ? 'offline' : 'online'}.
          </snack-bar>
        </app-header-layout>
      </app-drawer-layout>
    `;
  }

  private _snackbarTimer: NodeJS.Timeout | any = undefined;
  private _article: Article = loadingArticle;
  private _isListView = true;

  constructor() {
    super();
    setPassiveTouchGestures(true);
  }
  
  protected async firstUpdated() {
    installRouter((location) => this.locationChanged(location));
    installOfflineWatcher((offline) => this.offlineChanged(offline));
    installMediaQueryWatcher(`(min-width: 460px)`, (matches) => this.layoutChanged(matches));
  }

  protected updated(changedProps: PropertyValues) {
    if (changedProps.has('_page')) {
      let ogType: string = 'website';
      let ogTitle: string = '';
      let ogImage: string = '__paltate_starturl__/images/manifest-icon-512.png';
      if (this._page === 'articles') {
        ogTitle = 'Predikningar';
      } else if (this._page === 'article') {
        ogType = 'article';
        ogTitle = this._article.title;
        ogImage = articleImageUrl(this._article);
      };
      updateMetadata({
        title: `${ogTitle} - ${this.appTitle}`,
        description: '__paltate_description__',
        url: window.location.href,
        image: ogImage
      });
      setMetaTag('property', 'og:title', ogTitle); // 'og:title' shall not contain the application title
      setMetaTag('property', 'og:type', ogType);
    }
  }

  protected layoutChanged(isWideLayout: boolean) {
    this.updateDrawerState(false && isWideLayout);
  }

  protected offlineChanged(offline: boolean) {
    const previousOffline = this._offline;
    this._offline = offline;

    // Don't show the snackbar on the first load of the page.
    if (previousOffline === undefined || previousOffline == offline) {
      return;
    }

    clearTimeout(this._snackbarTimer);
    this._snackbarOpened = true;
    this._snackbarTimer = setTimeout(() => { this._snackbarOpened = false }, 3000);
  }

  protected locationChanged(location: Location) {
    let path: string = (<any> window).decodeURIComponent(location.pathname);
    path = path.substr(document.head.baseURI.substr((<any> window).location.origin.length + 1).length);
    const pathParts: Array<string> = path.slice(1).split('/');
    this.loadPage(pathParts);

    // Close the drawer - in case the *path* change came from a link in the drawer.
    this.updateDrawerState(false);
  }

  protected updateDrawerState(opened: boolean) {
    if (opened !== this._drawerOpened) {
      this._drawerOpened = opened;
    }
  }

  protected loadPage(pathParts: Array<string>) {
    let index: number = pathParts[0].lastIndexOf('-');
    let type: string = pathParts[0].substr(index + 1, 2);
    this._isListView = true;
    if (pathParts[0] === '') {
      this._page = 'articles';
      import('./articles-view.js');
    } else if (type === 'ar') {
      import('./article-view.js');
      let articleSlug: string = pathParts[0];
      apiGetArticle(articleSlug).then(article => {
        if (article) {
          this._article = article;
          this._page = 'article';
          this._isListView = false;
        } else {
          this._page = 'error404';
          import('./error-404-view.js');
        }
      });
    } else {
      this._page = 'error404';
      import('./error-404-view.js');
    }
  }

  private _menuButtonClicked() {
    this.updateDrawerState(true);
  }

  private _backButtonClicked() {
    window.history.back();
  }

  private _drawerOpenedChanged(e: Event) {
    this.updateDrawerState(e && e.target && (<any>e.target).opened);
  }
}
