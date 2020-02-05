import { Article } from '../model/article';

interface ArticlesCache {
  articles: Array<Article>;
  numPages: number;
}

type ArticlesCaches = Map<number, ArticlesCache>;

let articlesCaches: ArticlesCaches = new Map();
let currentArticleTypeId: number = 0;

function rosetteServerUrl(): string {
  return  (<any>window).peltateOptions.rosetteServerUrl;
}

export async function apiGetArticles(articleTypeId: number): Promise<Array<Article>> {
  currentArticleTypeId = articleTypeId;
  if (articlesCaches.has(currentArticleTypeId)) {
    return (<ArticlesCache>articlesCaches.get(currentArticleTypeId)).articles;
  }

  let beforeToday: string = new Date().toISOString().slice(0, 10) + 'T23:59:29';
  let request = await fetch(`${rosetteServerUrl()}/api/articles/public/articleType/${articleTypeId}?page=${0}&chronologic=false&before=${beforeToday}`);
  let articles: Array<Article> = await request.json();
  articlesCaches.set(articleTypeId, { articles: articles, numPages: 0 });
  return articles;
}

export async function apiGetArticlesMore(): Promise<Array<Article>> {
  let articlesCache: ArticlesCache | undefined = articlesCaches.get(currentArticleTypeId);
  if (articlesCache) {
    articlesCache.numPages++;
    let beforeToday: string = new Date().toISOString().slice(0, 10) + 'T23:59:29';
    let request = await fetch(`${rosetteServerUrl()}/api/articles/public/articleType/${currentArticleTypeId}?page=${articlesCache.numPages}&chronologic=false&before=${beforeToday}`);
    let articles: Array<Article> = await request.json();
    articlesCache.articles.push(...articles);
    return articlesCache.articles;
  }
  return [];
}

export async function apiGetArticle(articleSlug: string): Promise<Article | undefined> {
  for (let articlesCache of articlesCaches.values()) {
    let article: Article | undefined = articlesCache.articles.find(a => a.slug === articleSlug);
    if (article) {
      return new Promise(resolve => resolve(article));
    }
  }

  let request = await fetch(`${rosetteServerUrl()}/api/articles/public/${articleSlug}`);
  return await request.json();
}
