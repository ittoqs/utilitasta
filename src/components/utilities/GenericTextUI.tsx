import React, { useState, useRef } from 'react';
import { Play, Copy, Check, Upload, Download, Loader2, Trash2 } from 'lucide-react';

interface GenericTextUIProps {
  title: string;
  description: string;
  inputLabel?: string;
  outputLabel?: string;
  buttonText?: string;
  placeholder?: string;
  modes?: { label: string; value: string }[];
  onExecute: (input: string, mode?: string) => string | Promise<string>;
}

export default function GenericTextUI({
  title,
  description,
  inputLabel = 'Input',
  outputLabel = 'Output',
  buttonText = 'Eksekusi',
  placeholder = 'Ketik atau tempel di sini...',
  modes,
  onExecute,
}: GenericTextUIProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState(modes?.[0]?.value);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExecute = async () => {
    setError(null);
    setLoading(true);
    try {
      const result = await onExecute(input, mode);
      setOutput(result);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setOutput('');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const val = (ev.target?.result as string) || '';
      setInput(val);
      if (!val) {
        setOutput('');
        setError(null);
      }
    };
    reader.readAsText(file);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'output.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">{title}</h2>
        <p className="text-slate-500 dark:text-slate-400">{description}</p>
      </div>

      {modes && modes.length > 0 && (
        <div className="flex space-x-2">
          {modes.map((m) => (
            <button
              key={m.value}
              onClick={() => setMode(m.value)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                mode === m.value
                  ? 'bg-[var(--btn-bg)] text-white'
                  : 'bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-neutral-700'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{inputLabel}</label>
            <div className="flex items-center space-x-4">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                className="hidden" 
                accept=".txt,.json,.csv,.tsv,.yaml,.xml,.env,.log"
              />
              <button
                onClick={() => {
                  setInput('');
                  setOutput('');
                  setError(null);
                }}
                disabled={!input}
                className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 disabled:opacity-50 transition-colors"
                title="Bersihkan input"
              >
                <Trash2 size={16} />
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
                title="Unggah file"
              >
                <Upload size={16} />
              </button>
            </div>
          </div>
          <textarea
            className="w-full h-64 p-3 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-neutral-900 focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500 focus:border-transparent outline-none resize-none font-mono text-sm text-slate-900 dark:text-slate-100 transition-colors"
            placeholder={placeholder}
            value={input}
            onChange={(e) => {
              const val = e.target.value;
              setInput(val);
              if (!val) {
                setOutput('');
                setError(null);
              }
            }}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{outputLabel}</label>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleCopy}
                disabled={!output}
                className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 disabled:opacity-50 transition-colors"
                title="Salin ke papan klip"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
              <button
                onClick={handleDownload}
                disabled={!output}
                className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 disabled:opacity-50 transition-colors"
                title="Unduh sebagai file teks"
              >
                <Download size={16} />
              </button>
            </div>
          </div>
          <textarea
            readOnly
            className="w-full h-64 p-3 border border-slate-300 dark:border-slate-700 rounded-md bg-slate-50 dark:bg-neutral-800 focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500 focus:border-transparent outline-none resize-none font-mono text-sm text-slate-900 dark:text-slate-100 transition-colors"
            value={error ? error : output}
            style={{ color: error ? '#ef4444' : undefined }}
          />
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleExecute}
          disabled={loading || (!input && !error)}
          className="flex items-center justify-center space-x-2 px-6 py-2 bg-transparent border border-[var(--btn-bg)] text-[var(--btn-bg)] hover:bg-[var(--btn-bg)] hover:text-white rounded-md transition-all disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-[var(--btn-bg)]"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Play size={18} />}
          <span>{loading ? 'Memproses...' : buttonText}</span>
        </button>
      </div>
    </div>
  );
}
