import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import * as api from "./api/client";
import ArticlePreview from "./components/ArticlePreview";
import AuthorImage from "./components/AuthorImage";
import FollowAuthorButton from "./components/FollowAuthorButton";
import Layout from "./components/Layout";
import { Article as ArticleType, Profile as ProfileData } from "./types";

export default function Profile() {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [articles, setArticles] = useState<ArticleType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) return;

    setIsLoading(true);
    Promise.all([api.getProfile(username), api.getArticles({ author: username })])
      .then(([profileData, articlesData]) => {
        setProfile(profileData);
        setArticles(articlesData.articles);
      })
      .catch(() => setError("Failed to load profile"))
      .finally(() => setIsLoading(false));
  }, [username]);

  if (isLoading) {
    return (
      <Layout activePage="home">
        <div className="profile-page">
          <div className="container page">
            <p>Loading profile...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !profile) {
    return (
      <Layout activePage="home">
        <div className="profile-page">
          <div className="container page">
            <p>{error || "Profile not found"}</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout activePage="home">
      <div className="profile-page">
        <div className="user-info">
          <div className="container">
            <div className="row">
              <div className="col-xs-12 col-md-10 offset-md-1">
                <AuthorImage image={profile.image} alt={profile.username} className="user-img" />
                <h4>{profile.username}</h4>
                <p>{profile.bio}</p>
                <FollowAuthorButton
                  username={profile.username}
                  following={profile.following}
                  className="btn btn-sm btn-outline-secondary action-btn"
                  onUpdate={(following) => setProfile({ ...profile, following })}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <div className="articles-toggle">
                <ul className="nav nav-pills outline-active">
                  <li className="nav-item">
                    <a className="nav-link active" href="">
                      My Articles
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="">
                      Favorited Articles
                    </a>
                  </li>
                </ul>
              </div>

              {articles.length === 0 && <div className="article-preview">No articles are here... yet.</div>}
              {articles.map((article) => (
                <ArticlePreview key={article.slug} article={article} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
