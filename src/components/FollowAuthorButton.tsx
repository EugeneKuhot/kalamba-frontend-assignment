import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import * as api from "../api/client";
import { useAuth } from "../context/AuthContext";

interface FollowAuthorButtonProps {
  username: string;
  following: boolean;
  className?: string;
  showLabel?: boolean;
  onUpdate?: (following: boolean) => void;
}

export default function FollowAuthorButton({
  username,
  following,
  className = "btn btn-sm btn-outline-secondary",
  showLabel = true,
  onUpdate,
}: FollowAuthorButtonProps) {
  const { isAuthenticated, user } = useAuth();
  const history = useHistory();
  const [isFollowing, setIsFollowing] = useState(following);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsFollowing(following);
  }, [following]);

  if (user?.username === username) {
    return null;
  }

  const handleClick = async (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (!isAuthenticated) {
      history.push("/login");
      return;
    }

    setIsLoading(true);
    try {
      const profile = isFollowing ? await api.unfollowUser(username) : await api.followUser(username);
      setIsFollowing(profile.following);
      onUpdate?.(profile.following);
    } finally {
      setIsLoading(false);
    }
  };

  const activeClass = isFollowing ? "btn-secondary" : "btn-outline-secondary";

  return (
    <button className={`btn btn-sm ${activeClass} ${className}`} onClick={handleClick} disabled={isLoading}>
      <i className={isFollowing ? "ion-minus-round" : "ion-plus-round"} />
      {showLabel && (
        <>
          &nbsp; {isFollowing ? "Unfollow" : "Follow"} {username}
        </>
      )}
    </button>
  );
}
