const PLACEHOLDER_IMAGE = `${process.env.PUBLIC_URL}/default-avatar.svg`;

export function getAuthorImage(image?: string | null): string {
  return image && image.trim() !== "" ? image : PLACEHOLDER_IMAGE;
}
