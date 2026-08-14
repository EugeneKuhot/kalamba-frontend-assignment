import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import * as api from "../api/client";
import { useAuth } from "../context/AuthContext";

interface FavoriteArticleButtonProps {
  slug: string;
  favorited: boolean;
  favoritesCount: number;
  className?: string;
  showLabel?: boolean;
  onUpdate?: (favorited: boolean, favoritesCount: number) => void;
}

export default function FavoriteArticleButton({
  slug,
  favorited,
  favoritesCount,
  className = "btn btn-outline-primary btn-sm pull-xs-right",
  showLabel = false,
  onUpdate,
}: FavoriteArticleButtonProps) {
  const { isAuthenticated } = useAuth();
  const history = useHistory();
  const [isFavorited, setIsFavorited] = useState(favorited);
  const [count, setCount] = useState(favoritesCount);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsFavorited(favorited);
    setCount(favoritesCount);
  }, [favorited, favoritesCount]);

  const handleClick = async (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (!isAuthenticated) {
      history.push("/login");
      return;
    }

    setIsLoading(true);
    try {
      const article = isFavorited ? await api.unfavoriteArticle(slug) : await api.favoriteArticle(slug);
      setIsFavorited(article.favorited);
      setCount(article.favoritesCount);
      onUpdate?.(article.favorited, article.favoritesCount);
    } finally {
      setIsLoading(false);
    }
  };

  const buttonClass = className.replace("btn-outline-primary", "").replace("btn-primary", "");
  const activeClass = isFavorited ? "btn-primary" : "btn-outline-primary";

  return (
    <button className={`${buttonClass} ${activeClass}`.trim()} onClick={handleClick} disabled={isLoading}>
      <i className="ion-heart" />
      {showLabel ? (
        <>
          &nbsp; {isFavorited ? "Unfavorite" : "Favorite"} Post <span className="counter">({count})</span>
        </>
      ) : (
        <> {count}</>
      )}
    </button>
  );
}
