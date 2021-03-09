import { GetContentQuery } from "../../../../types/api";
import { BlogResponse } from "../../../../types/blog";

// src/api/v1/blogs/_id@string/index.ts
export type Methods = {
  get: {
    query?: GetContentQuery;
    resBody: BlogResponse;
  }
}
