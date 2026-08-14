import React from "react";
import { Link } from "react-router-dom";

import { Article } from "../types";
import { formatDate } from "../utils/formatDate";
import { AuthorImageLink } from "./AuthorImage";
import FavoriteArticleButton from "./FavoriteArticleButton";

interface ArticlePreviewProps {
  article: Article;
}

export default function ArticlePreview({ article }: ArticlePreviewProps) {
  return (
    <div className="article-preview">
      <div className="article-meta">
        <AuthorImageLink username={article.author.username} image={article.author.image} />
        <div className="info">
          <Link to={`/profile/${article.author.username}`} className="author">
            {article.author.username}
          </Link>
          <span className="date">{formatDate(article.createdAt)}</span>
        </div>
        <FavoriteArticleButton
          slug={article.slug}
          favorited={article.favorited}
          favoritesCount={article.favoritesCount}
        />
      </div>
      <Link to={`/${article.slug}`} className="preview-link">
        <h1>{article.title}</h1>
        <p>{article.description}</p>
        <span>Read more...</span>
      </Link>
    </div>
  );
}
