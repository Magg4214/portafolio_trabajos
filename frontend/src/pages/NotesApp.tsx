import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import TopBar from '../components/TopBar';
import SideBar from '../components/SideBar';
import NoteCard from '../components/NoteCard';
import NoteEditor from '../components/NoteEditor';
import { notesApi } from '../api/notes';
import type { Note } from '../types';

export default function NotesApp() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [archivedTab, setArchivedTab] = useState(false);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<Note | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await notesApi.list({ archived: archivedTab, categoryId: categoryId ?? undefined });
      setNotes(data);
    } catch (e: any) {
      setError(e.message || 'Error loading notes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [archivedTab, categoryId]);

  const onCreate = async (data: { title: string; content: string }) => {
    const optimistic: Note = {
      id: Math.random(),
      title: data.title,
      content: data.content,
      archived: false,
      categories: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Note;
    setNotes((prev) => [optimistic, ...prev]);
    try {
      const saved = await notesApi.create(data);
      setNotes((prev) => prev.map((n) => (n.id === optimistic.id ? saved : n)));
    } catch (e) {
      setNotes((prev) => prev.filter((n) => n.id !== optimistic.id));
      throw e;
    }
  };

  const onUpdate = async (id: number, data: Partial<Pick<Note, 'title' | 'content'>>) => {
    const old = notes.find((n) => n.id === id);
    if (!old) return;
    const patched = { ...old, ...data, updatedAt: new Date().toISOString() } as Note;
    setNotes((prev) => prev.map((n) => (n.id === id ? patched : n)));
    try {
      const saved = await notesApi.update(id, data);
      setNotes((prev) => prev.map((n) => (n.id === id ? saved : n)));
    } catch (e) {
      setNotes((prev) => prev.map((n) => (n.id === id ? old : n)) as Note[]);
      throw e;
    }
  };

  const onDelete = async (note: Note) => {
    const ok = window.confirm('Delete this note?');
    if (!ok) return;
    const prev = notes;
    setNotes((list) => list.filter((n) => n.id !== note.id));
    try {
      await notesApi.remove(note.id);
    } catch {
      setNotes(prev);
    }
  };

  const onToggleArchive = async (note: Note) => {
    const prev = notes;
    const toggledArchived = !note.archived;
    const temp = { ...note, archived: toggledArchived } as Note;
    // Optimistic UI: if we are on a tab that would exclude the note, remove immediately
    setNotes((list) => {
      if ((archivedTab && !toggledArchived) || (!archivedTab && toggledArchived)) {
        return list.filter((n) => n.id !== note.id);
      }
      return list.map((n) => (n.id === note.id ? temp : n));
    });
    try {
      if (note.archived) {
        await notesApi.unarchive(note.id);
      } else {
        await notesApi.archive(note.id);
      }
      // Reload to ensure consistency and correct filtering
      await load();
    } catch {
      setNotes(prev);
    }
  };

  const title = useMemo(() => (archivedTab ? 'Archived notes' : 'Active notes'), [archivedTab]);

  return (
    <div className="min-h-dvh bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-pastel-blue/20 via-white to-pastel-pink/20">
      <TopBar />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          <div className="md:col-span-3">
            <SideBar selectedCategoryId={categoryId} onSelect={setCategoryId} />
          </div>
          <div className="md:col-span-9">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-black text-gray-800 tracking-tight">
                  {archivedTab ? 'Archive' : 'My Notes'}
                </h2>
                <p className="text-sm font-medium text-gray-500 mt-1">
                  {notes.length} {notes.length === 1 ? 'note' : 'notes'} found
                  {categoryId != null && ` in this category`}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 rounded-2xl bg-gray-100/50 p-1.5 backdrop-blur-sm">
                  <button
                    className={`rounded-xl px-4 py-2 text-sm font-bold transition-all ${!archivedTab ? 'bg-white text-pastel-purple shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'}`}
                    onClick={() => setArchivedTab(false)}
                  >
                    Active
                  </button>
                  <button
                    className={`rounded-xl px-4 py-2 text-sm font-bold transition-all ${archivedTab ? 'bg-white text-pastel-purple shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'}`}
                    onClick={() => setArchivedTab(true)}
                  >
                    Archived
                  </button>
                </div>
                
                <motion.button 
                  whileHover={{ scale: 1.02, y: -2 }} 
                  whileTap={{ scale: 0.98 }} 
                  className="btn btn-primary px-6 py-3 text-sm font-bold shadow-lg" 
                  onClick={() => { setEditing(null); setEditorOpen(true); }}
                >
                  <svg className="mr-2" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  New Note
                </motion.button>
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 rounded-2xl bg-red-50 p-4 text-sm font-medium text-red-600 border border-red-100"
              >
                {error}
              </motion.div>
            )}

            {loading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-64 animate-pulse rounded-3xl bg-white/50 border border-white/40 shadow-sm" />
                ))}
              </div>
            ) : notes.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass flex flex-col items-center justify-center rounded-3xl border border-white/40 p-20 text-center"
              >
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-50 text-4xl">
                  {archivedTab ? '📂' : '📝'}
                </div>
                <h3 className="text-xl font-bold text-gray-800">No notes here</h3>
                <p className="mt-2 text-gray-500 max-w-xs">
                  {archivedTab 
                    ? "Your archive is empty. You can archive notes to keep things organized." 
                    : "Ready to capture your thoughts? Create your first note now!"}
                </p>
                {!archivedTab && (
                  <button 
                    className="mt-6 btn btn-ghost border border-gray-200"
                    onClick={() => { setEditing(null); setEditorOpen(true); }}
                  >
                    Start Writing
                  </button>
                )}
              </motion.div>
            ) : (
              <AnimatePresence mode="popLayout">
                <motion.div 
                  layout
                  className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
                >
                  {notes.map((n) => (
                    <NoteCard 
                      key={n.id} 
                      note={n} 
                      onEdit={(note) => { setEditing(note); setEditorOpen(true); }} 
                      onDelete={onDelete} 
                      onToggleArchive={onToggleArchive} 
                    />
                  ))}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </main>

      <NoteEditor
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        note={editing}
        onCreate={onCreate}
        onUpdate={onUpdate}
      />
    </div>
  );
}
