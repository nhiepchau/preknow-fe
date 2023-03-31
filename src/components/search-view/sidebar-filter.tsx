import ArrowNarrowLeft from '@/components/icons/arrow-narrow-left';
import CategoryFilter from '@/components/search-view/category-filter-view';
import PriceFilter from '@/components/search-view/price-filter';
import Button from '@/components/ui/button';
import { CustomDisclosure } from '@/components/ui/disclosure';
import Search from '@/components/ui/search/search';
import { useIsRTL } from '@/lib/locals';
import { drawerAtom } from '@/store/drawer-atom';
import classNames from 'classnames';
import { useAtom } from 'jotai';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Sorting from './sorting';

const FieldWrapper = ({ children, title }: any) => (
  <div className="border-b border-gray-200 py-7 last:border-0">
    <CustomDisclosure title={title}>{children}</CustomDisclosure>
  </div>
);

function ClearFiltersButton() {
  const { t } = useTranslation('common');
  const router = useRouter();

  function clearFilters() {
    const {
      price,
      category,
      sortedBy,
      orderBy,
      tags,
      manufacturer,
      text,
      ...rest
    } = router.query;
    router.push({
      pathname: router.pathname,
      query: {
        ...rest,
        ...(router.route !== '/[searchType]/search' && { manufacturer }),
      },
    });
  }
  return (
    <button
      className="text-sm font-semibold text-body transition-colors hover:text-red-500 focus:text-red-500 focus:outline-none lg:m-0"
      onClick={clearFilters}
    >
      Xóa tất cả
    </button>
  );
}
const SidebarFilter: React.FC<{
  type?: string;
  showManufacturers?: boolean;
  className?: string;
}> = ({ type, showManufacturers = true, className }) => {
  const router = useRouter();
  const { isRTL } = useIsRTL();
  const { t } = useTranslation('common');
  const [_, closeSidebar] = useAtom(drawerAtom);

  return (
    <div
      className={classNames(
        'flex h-full w-full flex-col rounded-xl border-gray-200 bg-white lg:h-auto lg:border',
        className
      )}
    >
      <div className="sticky top-0 z-10 flex items-center justify-between rounded-tl-xl rounded-tr-xl border-b border-gray-200 bg-white px-5 py-6 lg:static">
        <div className="flex items-center space-x-3 rtl:space-x-reverse lg:space-x-0">
          <button
            className="text-body focus:outline-none lg:hidden"
            onClick={() => closeSidebar({ display: false, view: '' })}
          >
            <ArrowNarrowLeft
              className={classNames('h-7', {
                'rotate-180': isRTL,
              })}
              strokeWidth={1.7}
            />
            <span className="sr-only">{t('text-close')}</span>
          </button>

          <h3 className="text-xl font-semibold text-heading lg:text-2xl">
            Bộ lọc
          </h3>
        </div>

        <ClearFiltersButton />
      </div>

      <div className="flex-1 px-5">
        <FieldWrapper title="Tìm kiếm">
          <Search variant="minimal" label="search" />
        </FieldWrapper>

        {router.route !== '/[searchType]/search' && (
          <FieldWrapper title="Sắp xếp">
            <Sorting />
          </FieldWrapper>
        )}

        <FieldWrapper title="Danh mục sản phẩm">
          <CategoryFilter />
        </FieldWrapper>

        <FieldWrapper title="Sắp xếp theo khoảng giá">
          <PriceFilter />
        </FieldWrapper>

        {/* <FieldWrapper title="text-tags">
          <TagFilter />
        </FieldWrapper>

        {showManufacturers && (
          <FieldWrapper title="text-manufacturers">
            <ManufacturerFilter />
          </FieldWrapper>
        )} */}
      </div>
      <div className="sticky bottom-0 z-10 mt-auto border-t border-gray-200 bg-white p-5 lg:hidden">
        <Button
          className="w-full"
          onClick={() => closeSidebar({ display: false, view: '' })}
        >
          Show Products
        </Button>
      </div>
    </div>
  );
};

export default SidebarFilter;
