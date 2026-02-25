import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Product, ProductsQuery, ProductsResponse } from '../model/types';

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://dummyjson.com/products' }),
  endpoints: (builder) => ({
    getProducts: builder.query<ProductsResponse, ProductsQuery>({
      query: ({ limit = 10, skip = 0, q }) => {
        if (q) {
          return `/search?q=${q}&limit=${limit}&skip=${skip}`;
        }
        return `?limit=${limit}&skip=${skip}`;
      },
    }),
    getProductById: builder.query<Product, string>({
      query: (id) => `/${id}`,
    }),
  }),
});

export const { useGetProductsQuery, useGetProductByIdQuery } = productsApi;
