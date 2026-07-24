import { createContext, useContext, useState, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface AlertContextType {
  showAlert: (message: string, title?: string) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState('Peringatan');

  const showAlert = (msg: string, titleStr: string = 'Peringatan') => {
    setMessage(msg);
    setTitle(titleStr);
    setIsOpen(true);
  };

  const closeAlert = () => {
    setIsOpen(false);
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-xl border border-slate-200 dark:border-slate-800 w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-semibold text-slate-900 dark:text-white">{title}</h3>
              <button 
                onClick={closeAlert}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6 text-slate-700 dark:text-slate-300">
              <p>{message}</p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-neutral-800/50 flex justify-end">
              <button 
                onClick={closeAlert}
                className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-md font-medium transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </AlertContext.Provider>
  );
};
