export interface ArticleAuthor {
  slug: string;
  name: string;
}

export interface Article {
  slug: string;
  title: string;
  content?: string;
  time: string;
  authors?: Array<ArticleAuthor>;
  imageUrl?: string;
  recordingUrl?: string;
  expectingRecording?: boolean;
  articleSerieSlug?: string;
  articleSerieTitle?: string;
}

export function articleImageUrl(article: Article): string {
  return article.imageUrl ? article.imageUrl : 'image-templates/peltate-article-1080.png';
}

export function articleThumbImageUrl(article: Article): string {
  return article.imageUrl ? `${article.imageUrl}?size=article` : 'image-templates/peltate-article-1080.png';
}
