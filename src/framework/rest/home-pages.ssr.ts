import type {
  CategoryQueryOptions,
  HomePageProps,
  PopularProductQueryOptions,
} from '@/types';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { QueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import { API_ENDPOINTS } from './client/api-endpoints';
import preknowClient from './client/preknow';
import { CATEGORIES_PER_PAGE, PRODUCTS_PER_PAGE } from './client/variables';

type ParsedQueryParams = {
  pages: string[];
};

// This function gets called at build time
export const getStaticPaths: GetStaticPaths<ParsedQueryParams> = async ({
  locales,
}) => {
  // invariant(locales, 'locales is not defined');
  // const data = await client.types.all({ limit: 100 });
  // const paths = data?.flatMap((type) =>
  //   locales?.map((locale) => ({ params: { pages: [type.slug] }, locale }))
  // );
  // We'll pre-render only these paths at build time also with the slash route.
  return {
    paths: ['/'],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<
  HomePageProps,
  ParsedQueryParams
> = async ({ locale, params }) => {
  const queryClient = new QueryClient();

  // use to prefetch to cache `settings`
  // await queryClient.prefetchQuery(
  //   [API_ENDPOINTS.SETTINGS, { language: locale }],
  //   ({ queryKey }) => client.settings.all(queryKey[1] as SettingsQueryOptions)
  // );

  const productVariables = {
    limit: PRODUCTS_PER_PAGE,
  };
  await queryClient.prefetchInfiniteQuery(
    [API_ENDPOINTS.PRODUCTS, productVariables],
    ({ queryKey }) => preknowClient.products.all(queryKey[1] as any)
  );

  const popularProductVariables = {
    limit: 10,
  };
  await queryClient.prefetchQuery(
    [API_ENDPOINTS.PRODUCTS_POPULAR, popularProductVariables],
    ({ queryKey }) =>
      preknowClient.products.popular(queryKey[1] as PopularProductQueryOptions)
  );

  const categoryVariables = {
    limit: CATEGORIES_PER_PAGE,
  };
  await queryClient.prefetchInfiniteQuery(
    [API_ENDPOINTS.CATEGORIES, categoryVariables],
    ({ queryKey }) =>
      preknowClient.categories.all(queryKey[1] as CategoryQueryOptions)
  );

  return {
    props: {
      variables: {
        popularProducts: popularProductVariables,
        products: productVariables,
        categories: categoryVariables,
      },
      ...(await serverSideTranslations(locale!, ['common', 'banner'])),
      locale,
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
    revalidate: 120,
  };
};

/* Fix : locales: 14kB,
popularProducts: 30kB,
category: 22kB,
groups: 8kB,
group: 2kB,
settings: 2kB,
perProduct: 4.2 * 30 = 120kB,
total = 14 + 30 + 22 + 8 + 2 + 2 + 120 = 198kB
others: 225 - 198 = 27kB

 */
