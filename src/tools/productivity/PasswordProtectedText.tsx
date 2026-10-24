import React, { useState } from 'react';
import { FileLock, Lock, Unlock, Copy } from 'lucide-react';
import { CopyButton } from '../../components/common/CopyButton';
import { ErrorMessage } from '../../components/common/ErrorMessage';

export const PasswordProtectedText: React.FC = () => {
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [inputText, setInputText] = useState<string>('This is a highly confidential secret note.');
  const [password, setPassword] = useState<string>('');
  const [outputText, setOutputText] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Web Crypto PBKDF2 + AES-GCM
  const encrypt = async () => {
    if (!inputText.trim()) { setError('Please enter text to encrypt.'); return; }
    if (!password) { setError('Please provide a secret passphrase.'); return; }
    setError(null);

    try {
      const enc = new TextEncoder();
      const salt = crypto.getRandomValues(new Uint8Array(16));
      const iv = crypto.getRandomValues(new Uint8Array(12));

      const keyMaterial = await crypto.subtle.importKey(
        'raw',
        enc.encode(password),
        { name: 'PBKDF2' },
        false,
        ['deriveKey']
      );

      const key = await crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt,
          iterations: 100000,
          hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt']
      );

      const encryptedContent = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        enc.encode(inputText)
      );

      // Pack salt + iv + ciphertext into base64
      const combined = new Uint8Array(salt.length + iv.length + encryptedContent.byteLength);
      combined.set(salt, 0);
      combined.set(iv, salt.length);
      combined.set(new Uint8Array(encryptedContent), salt.length + iv.length);

      const base64Cipher = btoa(String.fromCharCode(...combined));
      setOutputText(base64Cipher);
    } catch {
      setError('Encryption failed.');
    }
  };

  const decrypt = async () => {
    if (!inputText.trim()) { setError('Please enter encrypted text.'); return; }
    if (!password) { setError('Please provide the secret passphrase.'); return; }
    setError(null);

    try {
      const binaryString = atob(inputText.trim());
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      if (bytes.length < 28) {
        throw new Error('Invalid encrypted payload length.');
      }

      const salt = bytes.slice(0, 16);
      const iv = bytes.slice(16, 28);
      const ciphertext = bytes.slice(28);

      const enc = new TextEncoder();
      const keyMaterial = await crypto.subtle.importKey(
        'raw',
        enc.encode(password),
        { name: 'PBKDF2' },
        false,
        ['deriveKey']
      );

      const key = await crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt,
          iterations: 100000,
          hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['decrypt']
      );

      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        ciphertext
      );

      const dec = new TextDecoder();
      setOutputText(dec.decode(decrypted));
    } catch {
      setError('Decryption failed! Incorrect passphrase or corrupted payload.');
      setOutputText('');
    }
  };

  return (
    <div className="space-y-6">
      <ErrorMessage message={error || undefined} onDismiss={() => setError(null)} />

      {/* Mode switcher */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 flex items-center gap-2 text-xs font-semibold">
        <button
          type="button"
          onClick={() => { setMode('encrypt'); setOutputText(''); setError(null); }}
          className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
            mode === 'encrypt'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 border border-slate-200 text-slate-700 dark:text-slate-300'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Encrypt Text (AES-GCM 256)</span>
        </button>

        <button
          type="button"
          onClick={() => { setMode('decrypt'); setOutputText(''); setError(null); }}
          className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
            mode === 'decrypt'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 border border-slate-200 text-slate-700 dark:text-slate-300'
          }`}
        >
          <Unlock className="w-3.5 h-3.5" />
          <span>Decrypt Text with Passphrase</span>
        </button>
      </div>

      {/* Secret Passphrase input */}
      <div className="p-4 rounded-2xl bg-teal-50/50 dark:bg-teal-950/30 border border-teal-200/80 dark:border-teal-800/80">
        <label className="block text-xs font-bold text-teal-800 dark:text-teal-300 mb-1">
          Secret Passphrase / Key
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter a secret password used to lock or unlock this text..."
          className="w-full px-3 py-2 text-sm rounded-xl bg-white dark:bg-slate-900 border border-teal-300 dark:border-teal-800"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
            {mode === 'encrypt' ? 'Plain Text to Lock' : 'Encrypted Ciphertext'}
          </label>
          <textarea
            rows={8}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full p-4 text-xs font-mono rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
          />
          <button
            type="button"
            onClick={mode === 'encrypt' ? encrypt : decrypt}
            className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs"
          >
            {mode === 'encrypt' ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
            <span>{mode === 'encrypt' ? 'Encrypt Now' : 'Decrypt Now'}</span>
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-teal-700 dark:text-teal-400 block">
              {mode === 'encrypt' ? 'Encrypted Result (Ciphertext)' : 'Decrypted Secret Text'}
            </label>
            <CopyButton textToCopy={outputText} />
          </div>
          <textarea
            rows={8}
            readOnly
            value={outputText}
            placeholder={mode === 'encrypt' ? 'Encrypted string will appear here...' : 'Decrypted note will appear here...'}
            className="w-full p-4 text-xs font-mono rounded-2xl bg-white dark:bg-slate-900 border border-teal-200 dark:border-teal-900/60 text-slate-800 dark:text-slate-200"
          />
        </div>
      </div>
    </div>
  );
};
