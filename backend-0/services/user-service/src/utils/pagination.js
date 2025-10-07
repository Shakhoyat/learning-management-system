// Pagination utility function
const paginate = (data, total, page, limit) => {
  const currentPage = parseInt(page);
  const pageSize = parseInt(limit);
  const totalPages = Math.ceil(total / pageSize);
  const hasNext = currentPage < totalPages;
  const hasPrev = currentPage > 1;

  return {
    data,
    pagination: {
      total,
      totalPages,
      currentPage,
      pageSize,
      hasNext,
      hasPrev,
      nextPage: hasNext ? currentPage + 1 : null,
      prevPage: hasPrev ? currentPage - 1 : null,
    },
  };
};

module.exports = { paginate };
