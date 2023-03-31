import { CloseIcon } from '@/components/icons/close-icon';
import PreknowLogo from '@/components/icons/preknow-logo';
import { drawerAtom } from '@/store/drawer-atom';
import { useAtom } from 'jotai';
import { useTranslation } from 'next-i18next';

const DrawerWrapper: React.FC = ({ children }) => {
  const { t } = useTranslation('common');
  const [_, closeSidebar] = useAtom(drawerAtom);
  return (
    <div className="flex h-full flex-col">
      <div className="fixed top-0 z-20 mb-4 flex w-full max-w-md items-center justify-between border-b border-border-200 border-opacity-75 bg-white p-5 md:mb-6">
        <PreknowLogo />
        <button
          onClick={() => closeSidebar({ display: false, view: '' })}
          className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 text-body transition-all duration-200 hover:bg-accent hover:text-light focus:bg-accent focus:text-light focus:outline-none"
        >
          <span className="sr-only">{t('text-close')}</span>
          <CloseIcon className="h-2.5 w-2.5" />
        </button>
      </div>
      <div className="pt-20">{children}</div>
    </div>
  );
};

export default DrawerWrapper;
