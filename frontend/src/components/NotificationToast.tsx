import { useEffect } from 'react';
import {
  HiOutlineCheckCircle,
  HiOutlineExclamation,
  HiOutlineInformationCircle,
  HiOutlineX,
} from 'react-icons/hi';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { hideNotification } from '../store/slices/uiSlice';

export default function NotificationToast() {
  const dispatch = useAppDispatch();
  const notification = useAppSelector((state) => state.ui.notifications);

  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        dispatch(hideNotification());
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [notification.show, dispatch]);

  if (!notification.show) {
    return null;
  }

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <HiOutlineCheckCircle className="h-5 w-5 text-green-400" />;
      case 'error':
        return <HiOutlineExclamation className="h-5 w-5 text-red-400" />;
      case 'warning':
        return <HiOutlineExclamation className="h-5 w-5 text-yellow-400" />;
      default:
        return <HiOutlineInformationCircle className="h-5 w-5 text-blue-400" />;
    }
  };

  const getBgColor = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      default:
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full">
      <div className={`rounded-lg border p-4 shadow-lg ${getBgColor()}`}>
        <div className="flex items-start">
          <div className="flex-shrink-0">{getIcon()}</div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {notification.message}
            </p>
          </div>
          <div className="ml-4 flex-shrink-0">
            <button
              type="button"
              onClick={() => dispatch(hideNotification())}
              className="inline-flex text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <HiOutlineX className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
