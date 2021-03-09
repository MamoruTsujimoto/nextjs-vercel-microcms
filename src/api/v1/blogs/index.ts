// src/api/v1/blogs/index.ts
import { GetListContentsQuery } from '../../../types/api';
import { BlogListResponse } from '../../../types/blog';

export type Methods = {
  get: {
    query?: GetListContentsQuery;
    resBody: BlogListResponse;
  }
};
