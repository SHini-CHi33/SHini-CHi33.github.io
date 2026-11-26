'use client';

import { useLocaleStore } from '@/lib/stores/localeStore';
import { useMessages } from '@/lib/i18n/useMessages';
import Script from 'next/script';

interface FooterProps {
  lastUpdated?: string;
  lastUpdatedByLocale?: Record<string, string | undefined>;
  defaultLocale?: string;
}

export default function Footer({ lastUpdated, lastUpdatedByLocale, defaultLocale = 'en' }: FooterProps) {
  const locale = useLocaleStore((state) => state.locale);
  const messages = useMessages();

  const resolvedLastUpdated =
    lastUpdatedByLocale?.[locale] ||
    (defaultLocale ? lastUpdatedByLocale?.[defaultLocale] : undefined) ||
    lastUpdated ||
    new Date().toLocaleDateString(locale || 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <footer className="border-t border-neutral-200/50 bg-neutral-50/50 dark:bg-neutral-900/50 dark:border-neutral-700/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* 👇 这里改成了单行平铺布局，并加入了 gap 控制间距 */}
        <div className="flex flex-wrap items-center justify-center text-xs text-neutral-500 gap-x-3 gap-y-2">
          
          {/* 1. 版权信息 */}
          <span>© 2026 Songwen Tian</span>
          <span className="hidden sm:inline text-neutral-300">|</span>

          {/* 2. 最后更新时间 */}
          <span>
            {messages.footer.lastUpdated}: {resolvedLastUpdated}
          </span>
          <span className="hidden sm:inline text-neutral-300">|</span>

          {/* 3. 不蒜子访问量统计 */}
          <div className="flex items-center space-x-2">
            <span id="busuanzi_container_site_pv">
              Total views: <span id="busuanzi_value_site_pv" className="font-semibold">...</span>
            </span>
            <span className="text-neutral-300">•</span>
            <span id="busuanzi_container_site_uv">
              Total visitors: <span id="busuanzi_value_site_uv" className="font-semibold">...</span>
            </span>
          </div>

        </div>

        {/* 引入不蒜子的 JS 脚本 */}
        <Script 
          src="//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js" 
          strategy="lazyOnload"
        />
        
      </div>
    </footer>
  );
}