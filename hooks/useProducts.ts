import useSWR, { SWRConfiguration } from 'swr';
import { IProduct } from '../interfaces/products';

//const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const useProducts = (url: string, config: SWRConfiguration = {}) => {
  //const { data, error } = useSWR<IProduct[]>(`/api${url}`, fetcher, config);
  const { data, error } = useSWR<IProduct[]>(`/api${url}`, config);

  return {
    products: data || [],
    isLoading: !error && !data,
    isError: error,
  };
};
