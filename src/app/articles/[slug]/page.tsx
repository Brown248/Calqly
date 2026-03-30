import { Metadata } from 'next';
import { ARTICLES } from '@/data/articles';
import ArticleClientSide from './ArticleClientSide';
import Head from 'next/head';

export function generateStaticParams() {
  return ARTICLES.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = ARTICLES.find((a) => a.slug === params.slug);

  if (!article) {
    return {
      title: 'ไม่พบบทความ',
    };
  }

  return {
    title: `${article.title}`,
    description: article.excerpt,
    alternates: {
      canonical: `/articles/${article.slug}`,
    },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.date,
      authors: ['CalqlyHub'],
    },
  };
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = ARTICLES.find((a) => a.slug === params.slug);

  if (!article) {
    return <ArticleClientSide slug={params.slug} />;
  }

  // Schema Markup for Article
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    author: {
      '@type': 'Organization',
      name: 'CalqlyHub',
    },
    datePublished: article.date,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArticleClientSide slug={params.slug} />
    </>
  );
}
