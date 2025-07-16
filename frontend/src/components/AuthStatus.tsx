import { useAppSelector } from '../store/hooks';

export default function AuthStatus() {
  const { isAuthenticated, user, isLoading } = useAppSelector((state) => state.auth);

  if (isLoading) {
    return (
      <div className="fixed top-4 left-4 z-50 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-2 rounded-md text-sm">
        Loading auth...
      </div>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className="fixed top-4 left-4 z-50 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-2 rounded-md text-sm">
        ✅ Authenticated as {user.name}
      </div>
    );
  }

  return (
    <div className="fixed top-4 left-4 z-50 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-3 py-2 rounded-md text-sm">
      ❌ Not authenticated
    </div>
  );
}
