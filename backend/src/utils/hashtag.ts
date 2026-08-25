const HASHTAG_PATTERN =
  /#[\p{L}\p{N}_]+/gu;

export function extractHashtags(
  content: string
): string[] {
  const matches =
    content.match(HASHTAG_PATTERN) ?? [];

  const normalized = matches.map(
    (hashtag) =>
      hashtag
        .slice(1)
        .trim()
        .toLowerCase()
  );

  return Array.from(
    new Set(normalized)
  );
}