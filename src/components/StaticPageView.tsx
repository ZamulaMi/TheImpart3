import React from 'react';
import { ArrowLeft, Mail, Globe, Send, MessageCircle, MapPin, Sparkles } from 'lucide-react';
import { StaticPageData, SiteLanguage, SiteSocialLinks } from '../types';
import { ContentRenderer } from './ContentRenderer';

interface StaticPageViewProps {
  page: StaticPageData;
  lang: SiteLanguage;
  socialLinks?: SiteSocialLinks;
  onBack: () => void;
  onSwitchLang?: (lang: SiteLanguage) => void;
  onNavigateToPage?: (pageSlug: 'about' | 'contacts') => void;
}

export const StaticPageView: React.FC<StaticPageViewProps> = ({
  page,
  lang,
  socialLinks,
  onBack,
  onSwitchLang,
  onNavigateToPage,
}) => {
  const isEn = lang === 'en';
  const title = isEn && page.titleEn ? page.titleEn : page.title;
  const content = isEn && page.contentEn ? page.contentEn : page.content;

  const currentSocials = socialLinks ? socialLinks[lang] : undefined;

  return (
    <article className="w-full bg-white animate-fadeIn pb-16 sm:pb-24">
      {/* Верхня навігаційна плашка з кнопкою повернення */}
      <div className="w-[92%] sm:w-[90%] md:w-[calc(26/34*100%)] mx-auto pt-6 sm:pt-10 pb-4 flex items-center justify-between border-b border-neutral-100">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-500 hover:text-black transition-colors cursor-pointer group focus:outline-none"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>{isEn ? 'Back to publication' : 'На головну'}</span>
        </button>

        {/* Швидкий перехід між постійними сторінками */}
        <div className="flex items-center gap-4 text-xs font-sans">
          <button
            type="button"
            onClick={() => onNavigateToPage?.('about')}
            className={`transition-colors cursor-pointer ${
              page.id === 'about'
                ? 'font-medium text-black underline underline-offset-4'
                : 'text-neutral-400 hover:text-black'
            }`}
          >
            {isEn ? 'About Project' : 'Про проєкт'}
          </button>
          <span className="text-neutral-300">•</span>
          <button
            type="button"
            onClick={() => onNavigateToPage?.('contacts')}
            className={`transition-colors cursor-pointer ${
              page.id === 'contacts'
                ? 'font-medium text-black underline underline-offset-4'
                : 'text-neutral-400 hover:text-black'
            }`}
          >
            {isEn ? 'Contacts' : 'Контакти'}
          </button>
        </div>
      </div>

      {/* Основний контейнер сторінки */}
      <div className="w-[92%] sm:w-[90%] md:w-[calc(26/34*100%)] max-w-4xl mx-auto pt-10 sm:pt-16">
        {/* Заголовна секція */}
        <header className="mb-10 sm:mb-14">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-400 mb-3 font-sans">
            <span>The Impart</span>
            <span>•</span>
            <span>{isEn ? 'Editorial' : 'Редакція'}</span>
          </div>

          <h1
            className="text-3xl sm:text-5xl md:text-6xl font-medium tracking-tight text-black leading-tight sm:leading-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {title}
          </h1>

          <div className="w-16 h-[2px] bg-black mt-6 sm:mt-8" />
        </header>

        {/* Текстовий зміст з багатим рендерером контенту */}
        <div className="prose prose-neutral max-w-none text-neutral-800 text-base sm:text-lg leading-relaxed sm:leading-loose">
          <ContentRenderer content={content} />
        </div>

        {/* Спеціальний блок швидких контактів для сторінки "Контакти" */}
        {page.id === 'contacts' && currentSocials && (
          <div className="mt-14 pt-10 border-t border-neutral-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 bg-neutral-50 rounded-xl border border-neutral-100 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-black text-white flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-medium text-sm text-black">
                  {isEn ? 'Direct Inquiries' : 'Електронна пошта'}
                </h4>
                <a
                  href="mailto:contact@theimpart.com"
                  className="text-xs text-neutral-600 hover:text-black hover:underline mt-1 inline-block"
                >
                  contact@theimpart.com
                </a>
              </div>
            </div>

            <div className="p-5 bg-neutral-50 rounded-xl border border-neutral-100 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-black text-white flex items-center justify-center shrink-0">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-medium text-sm text-black">
                  {isEn ? 'Social Communities' : 'Соціальні мережі'}
                </h4>
                <p className="text-xs text-neutral-500 mt-1">
                  {isEn ? 'Join conversations on Telegram & Threads' : 'Спілкуйтеся у Telegram та Threads'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Кнопка повернення внизу сторінки */}
        <div className="mt-16 pt-8 border-t border-neutral-100 flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-black hover:opacity-60 transition-opacity cursor-pointer font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isEn ? 'Back to all articles' : 'Повернутися до статей'}</span>
          </button>

          <span className="text-xs text-neutral-400 font-sans">
            {isEn ? 'The Impart Knowledge Space' : 'Простір знань The Impart'}
          </span>
        </div>
      </div>
    </article>
  );
};
