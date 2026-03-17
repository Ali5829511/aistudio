import React, { createContext, useContext, useState } from 'react';
import { t as translate, type Lang, type TranslationKey } from './i18n';

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'ar',
  setLang: () => {},
  t: (key) => key,
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLang] = useState<Lang>('ar');
  const t = (key: TranslationKey) => translate(key, lang);
  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLang = () => useContext(LanguageContext);

export const LanguageToggle = () => {
  const { lang, setLang } = useLang();
  return (
    <button
      onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
      className="flex items-center justify-center size-10 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all font-black text-xs tracking-wider"
      title={lang === 'ar' ? 'Switch to English' : 'التبديل للعربية'}
    >
      {lang === 'ar' ? 'EN' : 'عربي'}
    </button>
  );
};
