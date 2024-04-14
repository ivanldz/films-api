export interface Page<T> {
    records: T[];
    paginations: {
      page: number;
      pageSize: number;
      totalPages: number;
    };
  }
  