import { useTranslation } from 'react-i18next';
import {
  HiOutlineExternalLink,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineGlobe,
} from 'react-icons/hi';
import type { NewsSource } from '../types/sources';
import { Button, Card } from './index';

interface SourceCardProps {
  source: NewsSource;
  onToggleActive: (sourceId: number) => void;
  onViewSource: (source: NewsSource) => void;
}

export default function SourceCard({ source, onToggleActive, onViewSource }: SourceCardProps) {
  const { t } = useTranslation();

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {/* Source Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <HiOutlineGlobe className="h-6 w-6 text-gray-500 dark:text-gray-400" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                  {source.name}
                </h3>
                {source.is_active && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    Active
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{source.url}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => onToggleActive(source.id)}
              className={`p-2 rounded-full transition-colors ${
                source.is_active
                  ? 'bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900 dark:text-green-400'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400'
              }`}
            >
              {source.is_active ? (
                <HiOutlineEye className="h-5 w-5" />
              ) : (
                <HiOutlineEyeOff className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Source Content */}
      <div className="p-6">
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
          {source.description}
        </p>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <Button onClick={() => onViewSource(source)} className="flex-1">
            <HiOutlineGlobe className="mr-2 h-4 w-4" />
            {t('sources.viewSource')}
          </Button>
          <Button onClick={() => window.open(source.url, '_blank')} className="px-3">
            <HiOutlineExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
