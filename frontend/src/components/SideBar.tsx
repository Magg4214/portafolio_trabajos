import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { categoriesApi } from '../api/categories';
import type { Category } from '../types';

type Props = {
  selectedCategoryId?: number | null;
  onSelect: (id: number | null) => void;
};

export default function SideBar({ selectedCategoryId, onSelect }: Props) {
  const [cats, setCats] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setError(null);
      const data = await categoriesApi.list();
      setCats(data);
    } catch (e: any) {
      setError(e.message || 'Error loading categories');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const add = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      const created = await categoriesApi.create(name.trim());
      setCats((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
      setName('');
    } catch (e: any) {
      setError(e.message || 'Error creating category');
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: number) => {
    const prev = cats;
    setCats((list) => list.filter((c) => c.id !== id));
    try {
      await categoriesApi.remove(id);
      if (selectedCategoryId === id) onSelect(null);
    } catch (e) {
      // rollback on error
      setCats(prev);
    }
  };

  return (
    <aside className="glass h-full rounded-3xl p-6 border border-white/40 shadow-xl">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500">Categories</h2>
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-pastel-purple/20 text-[10px] font-bold text-pastel-purple">
          {cats.length}
        </span>
      </div>
      <div className="mb-6 flex flex-col gap-2">
        <input
          className="input transition-all focus:shadow-md"
          placeholder="New category..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && add()}
        />
        <button 
          className="btn btn-primary w-full shadow-md" 
          disabled={loading || !name.trim()} 
          onClick={add}
        >
          {loading ? 'Adding...' : 'Add Category'}
        </button>
      </div>
      {error && (
        <motion.p 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="mb-4 text-xs font-medium text-red-500 bg-red-50 p-2 rounded-lg"
        >
          {error}
        </motion.p>
      )}
      <div className="space-y-2">
        <button
          className={`group flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm font-medium transition-all hover:bg-white/40 ${selectedCategoryId == null ? 'bg-white shadow-sm text-pastel-purple' : 'text-gray-600'}`}
          onClick={() => onSelect(null)}
        >
          <span className={`h-2 w-2 rounded-full ${selectedCategoryId == null ? 'bg-pastel-purple animate-pulse' : 'bg-gray-300 group-hover:bg-gray-400'}`} />
          All Notes
        </button>
        <div className="h-[1px] w-full bg-gray-100/50 my-2" />
        <AnimatePresence>
          {cats.map((c) => (
            <motion.div
              key={c.id}
              layout
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="group flex items-center gap-1"
            >
              <button
                className={`flex-1 flex items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm font-medium transition-all hover:bg-white/40 ${selectedCategoryId === c.id ? 'bg-white shadow-sm text-pastel-purple' : 'text-gray-600'}`}
                onClick={() => onSelect(c.id)}
              >
                <span className={`h-2 w-2 rounded-full ${selectedCategoryId === c.id ? 'bg-pastel-purple' : 'bg-gray-300 group-hover:bg-pastel-purple/50'}`} />
                {c.name}
              </button>
              <button 
                className="opacity-0 group-hover:opacity-100 flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all" 
                onClick={() => remove(c.id)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </aside>
  );
}
