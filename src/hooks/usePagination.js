import { useState } from 'react';

export const usePagination = (initialPage = 0, initialSize = 10) => {
  const [page, setPage] = useState(initialPage);
  const [size, setSize] = useState(initialSize);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [sortBy, setSortBy] = useState('');
  const [sortDir, setSortDir] = useState('asc');

  const handlePageChange = newPage => {
    setPage(newPage);
  };

  const handleSizeChange = newSize => {
    setSize(newSize);
    setPage(0);
  };

  const handleSort = (field, direction) => {
    setSortBy(field);
    setSortDir(direction);
    setPage(0);
  };

  const updatePaginationInfo = data => {
    if (data.page !== undefined) setPage(data.page);
    if (data.totalPages !== undefined) setTotalPages(data.totalPages);
    if (data.totalElements !== undefined) setTotalElements(data.totalElements);
  };

  const reset = () => {
    setPage(initialPage);
    setSize(initialSize);
    setTotalPages(0);
    setTotalElements(0);
  };

  return {
    page,
    size,
    totalPages,
    totalElements,
    sortBy,
    sortDir,
    handlePageChange,
    handleSizeChange,
    handleSort,
    updatePaginationInfo,
    reset
  };
};
