export function shuffleBackgroundImage(postIds: string[]): string {
  const min = 0;
  const max = postIds.length;

  const idIndex = Math.floor(Math.random() * (max - min) + min);

  return postIds[idIndex];
}
