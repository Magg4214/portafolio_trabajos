import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Modal from './Modal';
import type { Category, CreateNoteInput, Note, UpdateNoteInput } from '../types';
import { categoriesApi } from '../api/categories';
import { notesApi } from '../api/notes';

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate: (data: CreateNoteInput) => Promise<void>;
  onUpdate: (id: number, data: UpdateNoteInput) => Promise<void>;
  note?: Note | null;
};

export default function NoteEditor({ open, onClose, onCreate, onUpdate, note }: Props) {
  const isEdit = !!note;
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [allCats, setAllCats] = useState<Category[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTitle(note?.title || '');
    setContent(note?.content || '');
    setSelectedIds(new Set((note?.categories || []).map((c) => c.id)));
  }, [note]);

  const loadCats = async () => {
    try {
      const cats = await categoriesApi.list();
      setAllCats(cats);
    } catch (e: any) {
      // ignore silently in editor
    }
  };
  useEffect(() => {
    if (open) loadCats();
  }, [open]);

  const assignedIds = useMemo(() => selectedIds, [selectedIds]);

  const toggleCategory = async (cat: Category) => {
    if (!note) return; // only in edit mode
    const exists = assignedIds.has(cat.id);
    // optimistic update
    const prev = new Set(selectedIds);
    const next = new Set(selectedIds);
    if (exists) next.delete(cat.id); else next.add(cat.id);
    setSelectedIds(next);
    try {
      if (exists) {
        await notesApi.removeCategory(note.id, cat.id);
      } else {
        await notesApi.addCategory(note.id, cat.id);
      }
    } catch {
      // rollback on error
      setSelectedIds(prev);
    }
  };

  const onSubmit = async () => {
    try {
      setError(null);
      setLoading(true);
      if (!title.trim() || !content.trim()) {
        setError('Title and content are required');
        setLoading(false);
        return;
      }
      if (isEdit && note) {
        await onUpdate(note.id, { title: title.trim(), content: content.trim() });
      } else {
        await onCreate({ title: title.trim(), content: content.trim() });
      }
      onClose();
    } catch (e: any) {
      setError(e.message || 'Save error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Refine Note' : 'Capture Thought'}
      actions={
        <>
          <button className="btn btn-ghost border border-gray-200" onClick={onClose}>Discard</button>
          <button className="btn btn-primary px-8 shadow-lg" disabled={loading} onClick={onSubmit}>
            {loading ? 'Saving…' : isEdit ? 'Update Note' : 'Create Note'}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-gray-500">Title</label>
          <input 
            className="input text-lg font-bold placeholder:font-normal placeholder:text-gray-300 transition-all focus:shadow-inner" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="Give your note a title..." 
          />
        </div>
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-gray-500">Content</label>
          <textarea 
            className="input min-h-[200px] resize-none py-4 leading-relaxed placeholder:text-gray-300 transition-all focus:shadow-inner" 
            value={content} 
            onChange={(e) => setContent(e.target.value)} 
            placeholder="What's on your mind?" 
          />
        </div>
        
        {isEdit && (
          <div className="pt-2">
            <div className="mb-3 flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Categories</label>
              <span className="text-[10px] text-gray-400 italic">Select to tag this note</span>
            </div>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
              {allCats.length === 0 && (
                <p className="text-xs text-gray-400">No categories created yet.</p>
              )}
              {allCats.map((c) => {
                const active = assignedIds.has(c.id);
                return (
                  <motion.button
                    key={c.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleCategory(c)}
                    className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                      active 
                        ? 'bg-pastel-purple text-white shadow-md' 
                        : 'bg-gray-50 text-gray-500 hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100'
                    }`}
                  >
                    #{c.name}
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}
      </div>
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="rounded-xl bg-red-50 p-3 text-sm font-medium text-red-600 border border-red-100"
        >
          {error}
        </motion.div>
      )}
    </Modal>
  );
}
