export interface ResponsePagination<T = any> {
  data: T[];
  pagination: Pagination;
}

interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
