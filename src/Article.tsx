import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import * as api from "./api/client";
import { AuthorImageLink } from "./components/AuthorImage";
import FavoriteArticleButton from "./components/FavoriteArticleButton";
import FollowAuthorButton from "./components/FollowAuthorButton";
import Layout from "./components/Layout";
import { Article as ArticleType } from "./types";
import { formatDate } from "./utils/formatDate";

export default function Article() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<ArticleType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    setIsLoading(true);
    api
      .getArticle(slug)
      .then(setArticle)
      .catch(() => setError("Article not found"))
      .finally(() => setIsLoading(false));
  }, [slug]);

  const updateArticle = (updates: Partial<ArticleType>) => {
    setArticle((current) => (current ? { ...current, ...updates } : current));
  };

  if (isLoading) {
    return (
      <Layout activePage="home">
        <div className="article-page">
          <div className="container page">
            <p>Loading article...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !article) {
    return (
      <Layout activePage="home">
        <div className="article-page">
          <div className="container page">
            <p>{error || "Article not found"}</p>
          </div>
        </div>
      </Layout>
    );
  }

  const articleMeta = (
    <div className="article-meta">
      <AuthorImageLink username={article.author.username} image={article.author.image} />
      <div className="info">
        <Link to={`/profile/${article.author.username}`} className="author">
          {article.author.username}
        </Link>
        <span className="date">{formatDate(article.createdAt)}</span>
      </div>
      <FollowAuthorButton
        username={article.author.username}
        following={article.author.following}
        onUpdate={(following) =>
          updateArticle({ author: { ...article.author, following } })
        }
      />
      &nbsp;&nbsp;
      <FavoriteArticleButton
        slug={article.slug}
        favorited={article.favorited}
        favoritesCount={article.favoritesCount}
        className="btn btn-sm btn-outline-primary"
        showLabel
        onUpdate={(favorited, favoritesCount) => updateArticle({ favorited, favoritesCount })}
      />
    </div>
  );

  return (
    <Layout activePage="home">
      <div className="article-page">
        <div className="banner">
          <div className="container">
            <h1>{article.title}</h1>
            {articleMeta}
          </div>
        </div>

        <div className="container page">
          <div className="row article-content">
            <div className="col-md-12">
              {article.body.split("\n").map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>

          <hr />

          <div className="article-actions">{articleMeta}</div>

          <div className="row">
            <div className="col-xs-12 col-md-8 offset-md-2">
              <form className="card comment-form">
                <div className="card-block">
                  <textarea className="form-control" placeholder="Write a comment..." rows={3} />
                </div>
                <div className="card-footer">
                  <img src="http://i.imgur.com/Qr71crq.jpg" className="comment-author-img" />
                  <button type="button" className="btn btn-sm btn-primary">
                    Post Comment
                  </button>
                </div>
              </form>

              <div className="card">
                <div className="card-block">
                  <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                </div>
                <div className="card-footer">
                  <a href="/#/profile/jacobschmidt" className="comment-author">
                    <img src="http://i.imgur.com/Qr71crq.jpg" className="comment-author-img" />
                  </a>
                  &nbsp;
                  <a href="/#/profile/jacobschmidt" className="comment-author">
                    Jacob Schmidt
                  </a>
                  <span className="date-posted">Dec 29th</span>
                </div>
              </div>

              <div className="card">
                <div className="card-block">
                  <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                </div>
                <div className="card-footer">
                  <a href="/#/profile/jacobschmidt" className="comment-author">
                    <img src="http://i.imgur.com/Qr71crq.jpg" className="comment-author-img" />
                  </a>
                  &nbsp;
                  <a href="/#/profile/jacobschmidt" className="comment-author">
                    Jacob Schmidt
                  </a>
                  <span className="date-posted">Dec 29th</span>
                  <span className="mod-options">
                    <i className="ion-edit" />
                    <i className="ion-trash-a" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
