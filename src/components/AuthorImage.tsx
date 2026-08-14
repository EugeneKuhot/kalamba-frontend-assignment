import React from "react";
import { Link } from "react-router-dom";

import { getAuthorImage } from "../utils/authorImage";

interface AuthorImageProps {
  image?: string | null;
  alt?: string;
  className?: string;
}

export default function AuthorImage({ image, alt = "", className }: AuthorImageProps) {
  return <img src={getAuthorImage(image)} alt={alt} className={className} />;
}

interface AuthorImageLinkProps extends AuthorImageProps {
  username: string;
}

export function AuthorImageLink({ username, image, alt, className }: AuthorImageLinkProps) {
  return (
    <Link to={`/profile/${username}`}>
      <AuthorImage image={image} alt={alt || username} className={className} />
    </Link>
  );
}
