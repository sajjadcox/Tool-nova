import React, { useState } from 'react';
import { Languages, Copy, Check, Volume2, ArrowRightLeft } from 'lucide-react';
import { ShareResultButton } from '../../components/common/ShareResultButton';

interface TranslationPair {
  en: string;
  bn: string;
  es: string;
  fr: string;
  de: string;
  hi: string;
}

const PHRASE_DICTIONARY: TranslationPair[] = [
  { en: 'hello', bn: 'হ্যালো / নমস্কার', es: 'hola', fr: 'bonjour', de: 'hallo', hi: 'नमस्ते' },
  { en: 'good morning', bn: 'শুভ সকাল', es: 'buenos días', fr: 'bonjour', de: 'guten morgen', hi: 'सुप्रभात' },
  { en: 'thank you', bn: 'ধন্যবাদ', es: 'gracias', fr: 'merci', de: 'danke', hi: 'धन्यवाद' },
  { en: 'welcome', bn: 'স্বাগতম', es: 'bienvenido', fr: 'bienvenue', de: 'willkommen', hi: 'स्वागत हे' },
  { en: 'how are you', bn: 'আপনি কেমন আছেন?', es: '¿cómo estás?', fr: 'comment allez-vous?', de: 'wie geht es dir?', hi: 'आप कैसे हैं?' },
  { en: 'yes', bn: 'হ্যাঁ', es: 'sí', fr: 'oui', de: 'ja', hi: 'हाँ' },
  { en: 'no', bn: 'না', es: 'no', fr: 'non', de: 'nein', hi: 'नहीं' },
  { en: 'please', bn: 'দয়া করে', es: 'por favor', fr: "s'il vous plaît", de: 'bitte', hi: 'कृपया' },
  { en: 'goodbye', bn: 'বিদায়', es: 'adiós', fr: 'au revoir', de: 'auf wiedersehen', hi: 'अलविदा' },
  { en: 'help', bn: 'সাহায্য', es: 'ayuda', fr: 'aide', de: 'hilfe', hi: 'मदद' },
  { en: 'tools', bn: 'টুলস / সরঞ্জাম', es: 'herramientas', fr: 'outils', de: 'werkzeuge', hi: 'उपकरण' },
  { en: 'developer', bn: 'ডেভেলপার', es: 'desarrollador', fr: 'développeur', de: 'entwickler', hi: 'डेवलपर' },
  { en: 'image', bn: 'ছবি / ইমেজ', es: 'imagen', fr: 'image', de: 'bild', hi: 'चित्र' },
  { en: 'file', bn: 'ফাইল', es: 'archivo', fr: 'fichier', de: 'datei', hi: 'फ़ाइल' },
  { en: 'speed', bn: 'গতি', es: 'velocidad', fr: 'vitesse', de: 'geschwindigkeit', hi: 'गति' },
  { en: 'privacy', bn: 'গোপনীয়তা', es: 'privacidad', fr: 'confidentialité', de: 'privatsphäre', hi: 'गोपनीयता' },
];

export const TextTranslator: React.FC = () => {
  const [inputText, setInputText] = useState<string>('hello, thank you for your help');
  const [sourceLang, setSourceLang] = useState<'en' | 'bn' | 'es' | 'fr' | 'de' | 'hi'>('en');
  const [targetLang, setTargetLang] = useState<'en' | 'bn' | 'es' | 'fr' | 'de' | 'hi'>('bn');
  const [copied, setCopied] = useState<boolean>(false);

  const translate = (text: string, src: string, tgt: string): string => {
    if (!text.trim()) return '';
    let out = text.toLowerCase();

    // Check exact phrases first
    for (const item of PHRASE_DICTIONARY) {
      const srcVal = (item as any)[src]?.toLowerCase();
      const tgtVal = (item as any)[tgt];
      if (srcVal && tgtVal && out.includes(srcVal)) {
        out = out.replace(new RegExp(`\\b${srcVal}\\b`, 'gi'), tgtVal);
      }
    }

    return out;
  };

  const translatedOutput = translate(inputText, sourceLang, targetLang);

  const handleSpeak = (txt: string, lang: string) => {
    if ('speechSynthesis' in window) {
      const utter = new SpeechSynthesisUtterance(txt);
      utter.lang = lang;
      window.speechSynthesis.speak(utter);
    }
  };

  const swapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setInputText(translatedOutput);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(translatedOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-teal-50 dark:bg-teal-950/50 rounded-xl text-teal-600 dark:text-teal-400">
              <Languages className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-100">Client-Side Offline Quick Translator</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Translate common terms, phrases, and technical words without external API keys.</p>
            </div>
          </div>
          <ShareResultButton
            toolName="Text Translator"
            resultSummary="Translated phrases with ToolNova Offline Quick Translator!"
          />
        </div>

        <div className="flex items-center justify-center gap-3 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
          <select
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value as any)}
            className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200"
          >
            <option value="en">English (US/UK)</option>
            <option value="bn">Bengali (বাংলা)</option>
            <option value="es">Spanish (Español)</option>
            <option value="fr">French (Français)</option>
            <option value="de">German (Deutsch)</option>
            <option value="hi">Hindi (हिन्दी)</option>
          </select>

          <button
            type="button"
            onClick={swapLanguages}
            className="p-2 text-slate-500 hover:text-teal-600 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            title="Swap Languages"
          >
            <ArrowRightLeft className="w-4 h-4" />
          </button>

          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value as any)}
            className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200"
          >
            <option value="bn">Bengali (বাংলা)</option>
            <option value="en">English (US/UK)</option>
            <option value="es">Spanish (Español)</option>
            <option value="fr">French (Français)</option>
            <option value="de">German (Deutsch)</option>
            <option value="hi">Hindi (हिन्दी)</option>
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400">Input Text</label>
              {inputText && (
                <button type="button" onClick={() => setInputText('')} className="text-xs text-slate-400 hover:text-red-500">
                  Clear
                </button>
              )}
            </div>
            <textarea
              rows={6}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type or paste phrase to translate..."
              className="w-full p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400">Translation</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSpeak(translatedOutput, targetLang)}
                  className="p-1 text-slate-500 hover:text-teal-600 rounded"
                  title="Listen Pronunciation"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold shadow-sm"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
            <textarea
              readOnly
              rows={6}
              value={translatedOutput}
              className="w-full p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-sm leading-relaxed text-slate-800 dark:text-slate-200 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
