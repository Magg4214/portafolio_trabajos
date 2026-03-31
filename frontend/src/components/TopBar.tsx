import { motion } from 'framer-motion';
import { useAuth } from '../providers/AuthProvider';

export default function TopBar() {
  const { user, logout } = useAuth();
  return (
    <div className="sticky top-0 z-50 w-full px-4 pt-4">
      <div className="mx-auto max-w-7xl glass flex h-16 items-center justify-between px-6 rounded-2xl">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex items-center gap-2"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pastel-purple to-pastel-pink shadow-lg">
            <span className="text-xl">✨</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-gray-800">
            Notes<span className="text-pastel-purple">.</span>
          </h1>
        </motion.div>

        <div className="flex items-center gap-6">
          {user && (
            <div className="hidden items-center gap-3 md:flex">
              <div className="h-8 w-[1px] bg-gray-200" />
              <div className="flex flex-col items-end">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">User</span>
                <span className="text-sm font-semibold text-gray-700">{user.email}</span>
              </div>
            </div>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-ghost border border-white/40 hover:bg-white hover:text-red-500"
            onClick={logout}
          >
            Logout
          </motion.button>
        </div>
      </div>
    </div>
  );
}
