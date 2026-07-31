export function getPagination(
  page: number = 1,
  limit: number = 10
) {
  const currentPage = Math.max(1, page);
  const currentLimit = Math.max(1, limit);

  return {
    skip: (currentPage - 1) * currentLimit,
    take: currentLimit,
    page: currentPage,
    limit: currentLimit,
  };
}

export function getPaginationMeta(
  total: number,
  page: number,
  limit: number
) {
  const totalPages = Math.ceil(total / limit);

  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}