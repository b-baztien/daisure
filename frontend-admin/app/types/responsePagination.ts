export interface ResponsePagination<T = any> {
  data: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}
