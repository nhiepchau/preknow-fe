import { AttributesProvider } from '@/components/products/details/attributes.context';
import Seo from '@/components/seo/seo';
import type { NextPageWithLayout } from '@/types';
import isEmpty from 'lodash/isEmpty';
import type { InferGetStaticPropsType } from 'next';
import dynamic from 'next/dynamic';

import HomeLayout from '@/components/layouts/_home';
import { getStaticPaths, getStaticProps } from '@/framework/product.ssr';
export { getStaticPaths, getStaticProps };
//FIXME: typescript and layout
const PreknowDetails = dynamic(
  () => import('@/components/products/details/preknow-details')
);

const ProductPage: NextPageWithLayout<
  InferGetStaticPropsType<typeof getStaticProps>
> = ({ product }: any) => {
  return (
    <>
      <Seo
        title={product.name}
        url={product._id}
        images={!isEmpty(product?.imageUrl) ? [product.imageUrl] : []}
      />
      <AttributesProvider>
        <div className="min-h-screen bg-gray-100">
          <PreknowDetails product={product} />

          {/* <PreknowProductReviews
            productId={product?.id}
            productType={product?.type?.slug}
          />
          {product.type?.slug !== 'books' &&
            product?.related_products?.length > 1 && (
              <div className="p-5 lg:p-14 xl:p-16">
                <RelatedProducts
                  products={product.related_products}
                  currentProductId={product.id}
                  gridClassName="lg:grid-cols-4 2xl:grid-cols-5 !gap-3"
                />
              </div>
            )} */}
        </div>
      </AttributesProvider>
    </>
  );
};
ProductPage.getLayout = function getLayout(page) {
  return (
    <HomeLayout layout={page.props.layout}>
      {page as React.ReactNode}
    </HomeLayout>
  );
};
export default ProductPage;
