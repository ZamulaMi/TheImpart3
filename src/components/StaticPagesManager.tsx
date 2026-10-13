import React, { useState, useEffect } from 'react';
import {
  FileText,
  Save,
  Check,
  Eye,
  Edit3,
  ExternalLink,
  Globe,
  RotateCcw,
  Sparkles,
  Info,
  Heading,
  Bold,
  Italic,
  List,
  Link as LinkIcon,
  Quote,
} from 'lucide-react';
import { SitePagesData, StaticPageId, DEFAULT_PAGES_DATA } from '../types';
import { ContentRenderer } from './ContentRenderer';

interface StaticPagesManagerProps {
  pages: SitePagesData;
  onSavePages: (pages: SitePagesData) => Promise<void> | void;
  onViewOnSite?: (pageSlug: 'about' | 'contacts') => void;
}

export const StaticPagesManager: React.FC<StaticPagesManagerProps> = ({
  pages,
  onSavePages,
  onViewOnSite,
}) => {
  const [selectedPageId, setSelectedPageId] = useState<StaticPageId>('about');
  const [langTab, setLangTab] = useState<'ua' | 'en'>('ua');
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  const [formData, setFormData] = useState<SitePagesData>(() => ({
    about: { ...DEFAULT_PAGES_DATA.about, ...(pages?.about || {}) },
    contacts: { ...DEFAULT_PAGES_DATA.contacts, ...(pages?.contacts || {}) },
  }));

  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (pages) {
      setFormData({
        about: { ...DEFAULT_PAGES_DATA.about, ...(pages.about || {}) },
        contacts: { ...DEFAULT_PAGES_DATA.contacts, ...(pages.contacts || {}) },
      });
    }
  }, [pages]);

  const currentPage = formData[selectedPageId];

  const handleTitleChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      [selectedPageId]: {
        ...prev[selectedPageId],
        [langTab === 'en' ? 'titleEn' : 'title']: val,
      },
    }));
  };

  const handleContentChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      [selectedPageId]: {
        ...prev[selectedPageId],
        [langTab === 'en' ? 'contentEn' : 'content']: val,
      },
    }));
  };

  const insertFormatting = (prefix: string, suffix: string = '') => {
    const textarea = document.getElementById('static-page-textarea') as HTMLTextAreaElement | null;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = (langTab === 'en' ? currentPage.contentEn : currentPage.content) || '';
    const selected = currentText.substring(start, end);
    const replacement = `${prefix}${selected || 'текст'}${suffix}`;
    const newText = currentText.substring(0, start) + replacement + currentText.substring(end);

    handleContentChange(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + (selected ? selected.length : 5));
    }, 50);
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const dataToSave: SitePagesData = {
        about: {
          ...formData.about,
          updatedAt: new Date().toISOString(),
        },
        contacts: {
          ...formData.contacts,
          updatedAt: new Date().toISOString(),
        },
      };

      await onSavePages(dataToSave);
      setSuccessMsg(`Сторінку «${selectedPageId === 'about' ? 'Про проєкт' : 'Контакти'}» успішно збережено!`);
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      console.error('Error saving static page:', err);
      setErrorMsg(err.message || 'Не вдалося зберегти зміни. Спробуйте ще раз.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDefault = () => {
    if (
      window.confirm(
        `Відновити стандартний текст для сторінки «${
          selectedPageId === 'about' ? 'Про проєкт' : 'Контакти'
        }»? Незбережені зміни буде втрачено.`
      )
    ) {
      setFormData((prev) => ({
        ...prev,
        [selectedPageId]: { ...DEFAULT_PAGES_DATA[selectedPageId] },
      }));
      setSuccessMsg('Стандартний зміст відновлено. Не забудьте натиснути «Зберегти зміни».');
      setTimeout(() => setSuccessMsg(null), 3000);
    }
  };

  const titleVal = langTab === 'en' ? currentPage.titleEn : currentPage.title;
  const contentVal = langTab === 'en' ? currentPage.contentEn : currentPage.content;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Шапка розділу */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2.5">
            <h1
              className="text-2xl sm:text-3xl font-medium tracking-tight text-black"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Редагування сторінок
            </h1>
            <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded">
              Лише адміністратор
            </span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Керування вмістом постійних сторінок сайту («Про проєкт» та «Контакти»). Посилання на них розміщені у футері.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {onViewOnSite && (
            <button
              type="button"
              onClick={() => onViewOnSite(selectedPageId)}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors cursor-pointer"
              title="Переглянути сторінку на сайті"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Переглянути на сайті</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => handleSave()}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white hover:bg-neutral-800 rounded-md text-xs sm:text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 shadow-xs"
          >
            {isSaving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Збереження...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Зберегти зміни</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Повідомлення про успіх / помилку */}
      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm rounded-lg flex items-center gap-2.5 animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm rounded-lg flex items-center gap-2.5 animate-fadeIn">
          <Info className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Вибір сторінки: "Про проєкт" або "Контакти" */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => {
            setSelectedPageId('about');
            setErrorMsg(null);
          }}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3.5 ${
            selectedPageId === 'about'
              ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm ring-2 ring-black/5'
              : 'bg-white hover:bg-neutral-50 text-neutral-800 border-neutral-200'
          }`}
        >
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
              selectedPageId === 'about' ? 'bg-white/10 text-white' : 'bg-neutral-100 text-neutral-700'
            }`}
          >
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="font-medium text-sm sm:text-base flex items-center gap-2">
              <span>Про проєкт</span>
              <span
                className={`text-[10px] uppercase font-mono px-1.5 py-0.5 rounded ${
                  selectedPageId === 'about' ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-500'
                }`}
              >
                /about
              </span>
            </div>
            <p
              className={`text-xs mt-1 line-clamp-1 ${
                selectedPageId === 'about' ? 'text-neutral-300' : 'text-neutral-500'
              }`}
            >
              Концепція журналу, місія, ключові тематичні напрями
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => {
            setSelectedPageId('contacts');
            setErrorMsg(null);
          }}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3.5 ${
            selectedPageId === 'contacts'
              ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm ring-2 ring-black/5'
              : 'bg-white hover:bg-neutral-50 text-neutral-800 border-neutral-200'
          }`}
        >
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
              selectedPageId === 'contacts' ? 'bg-white/10 text-white' : 'bg-neutral-100 text-neutral-700'
            }`}
          >
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="font-medium text-sm sm:text-base flex items-center gap-2">
              <span>Контакти</span>
              <span
                className={`text-[10px] uppercase font-mono px-1.5 py-0.5 rounded ${
                  selectedPageId === 'contacts' ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-500'
                }`}
              >
                /contacts
              </span>
            </div>
            <p
              className={`text-xs mt-1 line-clamp-1 ${
                selectedPageId === 'contacts' ? 'text-neutral-300' : 'text-neutral-500'
              }`}
            >
              Електронна пошта, канали зв'язку редакції, партнерства
            </p>
          </div>
        </button>
      </div>

      {/* Панель редагування вибраної сторінки */}
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-xs">
        {/* Верхня панель інструментів: перемикач мови та режим редагування / попередній перегляд */}
        <div className="px-5 py-3.5 bg-neutral-50/80 border-b border-neutral-200 flex flex-wrap items-center justify-between gap-3">
          {/* Мовні вкладки */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-500 font-medium flex items-center gap-1.5 mr-1">
              <Globe className="w-3.5 h-3.5" />
              <span>Мовна версія:</span>
            </span>
            <div className="inline-flex p-0.5 bg-neutral-200/80 rounded-lg">
              <button
                type="button"
                onClick={() => setLangTab('ua')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
                  langTab === 'ua' ? 'bg-white text-black shadow-xs' : 'text-neutral-600 hover:text-black'
                }`}
              >
                Українська (UA)
              </button>
              <button
                type="button"
                onClick={() => setLangTab('en')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
                  langTab === 'en' ? 'bg-white text-black shadow-xs' : 'text-neutral-600 hover:text-black'
                }`}
              >
                English (EN)
              </button>
            </div>
          </div>

          {/* Режим перегляду: Edit / Preview */}
          <div className="flex items-center gap-2">
            <div className="inline-flex p-0.5 bg-neutral-200/80 rounded-lg">
              <button
                type="button"
                onClick={() => setViewMode('edit')}
                className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
                  viewMode === 'edit' ? 'bg-white text-black shadow-xs' : 'text-neutral-600 hover:text-black'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Редагувати</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('preview')}
                className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
                  viewMode === 'preview' ? 'bg-white text-black shadow-xs' : 'text-neutral-600 hover:text-black'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Попередній перегляд</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleResetToDefault}
              className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200 rounded transition-colors cursor-pointer"
              title="Відновити стандартний текст"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Тіло редактора */}
        <div className="p-5 sm:p-7 space-y-6">
          {viewMode === 'edit' ? (
            <>
              {/* Поле назви сторінки */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">
                  Заголовок сторінки ({langTab.toUpperCase()})
                </label>
                <input
                  type="text"
                  value={titleVal || ''}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder={langTab === 'en' ? 'Page Title' : 'Заголовок сторінки'}
                  className="w-full px-3.5 py-2.5 text-base sm:text-lg font-medium text-black bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                />
              </div>

              {/* Текстовий редактор вмісту */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                    Вміст сторінки ({langTab.toUpperCase()})
                  </label>
                  <span className="text-[11px] text-neutral-400">Підтримує Markdown, списки, заголовки, посилання</span>
                </div>

                {/* Швидка панель форматування */}
                <div className="flex flex-wrap items-center gap-1 p-1.5 bg-neutral-100 rounded-t-lg border border-neutral-300 border-b-0">
                  <button
                    type="button"
                    onClick={() => insertFormatting('### ')}
                    className="p-1.5 text-xs text-neutral-700 hover:bg-white rounded transition-colors flex items-center gap-1 cursor-pointer"
                    title="Підзаголовок H3"
                  >
                    <Heading className="w-3.5 h-3.5" />
                    <span>H3</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('**', '**')}
                    className="p-1.5 text-xs text-neutral-700 hover:bg-white rounded transition-colors flex items-center gap-1 cursor-pointer font-bold"
                    title="Жирний шрифт"
                  >
                    <Bold className="w-3.5 h-3.5" />
                    <span>B</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('*', '*')}
                    className="p-1.5 text-xs text-neutral-700 hover:bg-white rounded transition-colors flex items-center gap-1 cursor-pointer italic"
                    title="Курсив"
                  >
                    <Italic className="w-3.5 h-3.5" />
                    <span>I</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('\n- ')}
                    className="p-1.5 text-xs text-neutral-700 hover:bg-white rounded transition-colors flex items-center gap-1 cursor-pointer"
                    title="Маркований список"
                  >
                    <List className="w-3.5 h-3.5" />
                    <span>Список</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('[текст посилання](', ')')}
                    className="p-1.5 text-xs text-neutral-700 hover:bg-white rounded transition-colors flex items-center gap-1 cursor-pointer"
                    title="Посилання"
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                    <span>Посилання</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('\n> ')}
                    className="p-1.5 text-xs text-neutral-700 hover:bg-white rounded transition-colors flex items-center gap-1 cursor-pointer"
                    title="Цитата"
                  >
                    <Quote className="w-3.5 h-3.5" />
                    <span>Цитата</span>
                  </button>
                </div>

                <textarea
                  id="static-page-textarea"
                  value={contentVal || ''}
                  onChange={(e) => handleContentChange(e.target.value)}
                  rows={16}
                  placeholder={
                    langTab === 'en'
                      ? 'Write page content here using Markdown formatting...'
                      : 'Напишіть текст сторінки тут з використанням Markdown розмітки...'
                  }
                  className="w-full p-4 text-sm font-mono text-neutral-900 bg-neutral-50 border border-neutral-300 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all resize-y leading-relaxed"
                />
              </div>
            </>
          ) : (
            /* Режим попереднього перегляду */
            <div className="py-4 px-2 sm:px-6">
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="border-b border-neutral-200 pb-5">
                  <span className="text-[11px] uppercase tracking-widest text-neutral-400 font-sans block mb-2">
                    The Impart • {selectedPageId === 'about' ? 'Про проєкт' : 'Контакти'}
                  </span>
                  <h1
                    className="text-3xl sm:text-4xl font-medium tracking-tight text-black"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    {titleVal || (langTab === 'en' ? 'Untitled' : 'Без назви')}
                  </h1>
                </div>

                <div className="prose prose-neutral max-w-none text-neutral-800 text-sm sm:text-base leading-relaxed">
                  <ContentRenderer content={contentVal || ''} />
                </div>
              </div>
            </div>
          )}

          {/* Нижня панель дій */}
          <div className="pt-4 border-t border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-xs text-neutral-400">
              {currentPage.updatedAt && (
                <span>
                  Останнє оновлення:{' '}
                  {new Date(currentPage.updatedAt).toLocaleDateString('uk-UA', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleSave()}
                disabled={isSaving}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-black text-white hover:bg-neutral-800 rounded-md text-xs sm:text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 shadow-xs"
              >
                {isSaving ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Збереження...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Зберегти зміни</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
