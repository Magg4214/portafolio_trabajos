import { motion } from 'framer-motion';
import type { Note } from '../types';

type Props = {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (note: Note) => void;
  onToggleArchive: (note: Note) => void;
};

export default function NoteCard({ note, onEdit, onDelete, onToggleArchive }: Props) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4 }}
      className="glass group relative flex flex-col h-full rounded-3xl border border-white/40 p-5 transition-all hover:shadow-2xl hover:bg-white/80"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="text-xl font-bold text-gray-800 line-clamp-2 leading-tight group-hover:text-pastel-purple transition-colors">
          {note.title}
        </h3>
      </div>
      
      <p className="flex-1 text-sm leading-relaxed text-gray-600 line-clamp-5 whitespace-pre-wrap mb-4">
        {note.content}
      </p>

      <div className="mt-auto pt-4 border-t border-gray-100/50">
        <div className="flex flex-wrap gap-1.5 mb-4">
          {note.categories?.map((c) => (
            <span key={c.id} className="rounded-lg bg-pastel-blue/20 px-2.5 py-1 text-[10px] font-bold text-pastel-blue uppercase tracking-wider">
              #{c.name}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[10px] font-medium text-gray-400">
            {new Date(note.updatedAt).toLocaleDateString()}
          </span>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
            <button 
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm text-gray-600 hover:text-pastel-purple hover:scale-110 transition-all" 
              onClick={() => onEdit(note)}
              title="Edit"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
            </button>
            <button 
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm text-gray-600 hover:text-pastel-blue hover:scale-110 transition-all" 
              onClick={() => onToggleArchive(note)}
              title={note.archived ? 'Unarchive' : 'Archive'}
            >
              {note.archived ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v8"/><path d="m16 6-4-4-4 4"/><rect width="20" height="8" x="2" y="14" rx="2"/><path d="M6 18h.01"/><path d="M10 18h.01"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="21 8 21 21 3 21 3 8"/><rect width="22" height="5" x="1" y="3"/><line x1="10" y1="12" x2="14" y2="12"/></svg>
              )}
            </button>
            <button 
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm text-gray-600 hover:text-red-500 hover:scale-110 transition-all" 
              onClick={() => onDelete(note)}
              title="Delete"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
