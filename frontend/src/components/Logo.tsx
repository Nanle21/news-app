import { useTheme } from '../contexts/ThemeContext';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function Logo({ className = '', size = 'md' }: LogoProps) {
  const { isDark } = useTheme();

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const getColors = () => ({
    background: isDark ? '#1F2937' : '#FFFFFF',
    stroke: isDark ? '#374151' : '#E2E8F0',
    backPaper: isDark ? '#374151' : '#E5E7EB',
    middlePaper: isDark ? '#4B5563' : '#F3F4F6',
    frontPaper: isDark ? '#6B7280' : '#FFFFFF',
    text: isDark ? '#E5E7EB' : '#374151',
    textSecondary: isDark ? '#6B7280' : '#9CA3AF',
  });

  const colors = getColors();

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        fill="none"
        className="w-full h-full"
        role="img"
        aria-label="News Aggregator Logo"
      >
        {/* Background circle */}
        <circle
          cx="24"
          cy="24"
          r="22"
          fill={colors.background}
          stroke={colors.stroke}
          strokeWidth="2"
        />

        {/* Newspaper stack effect */}
        <g transform="translate(12, 8)">
          {/* Back newspaper */}
          <rect x="0" y="2" width="20" height="28" rx="2" fill={colors.backPaper} opacity="0.6" />
          <rect x="2" y="4" width="16" height="2" rx="1" fill={colors.textSecondary} />
          <rect x="2" y="8" width="12" height="1" rx="0.5" fill={colors.textSecondary} />
          <rect x="2" y="11" width="14" height="1" rx="0.5" fill={colors.textSecondary} />
          <rect x="2" y="14" width="10" height="1" rx="0.5" fill={colors.textSecondary} />

          {/* Middle newspaper */}
          <rect x="1" y="1" width="20" height="28" rx="2" fill={colors.middlePaper} opacity="0.8" />
          <rect x="3" y="3" width="16" height="2" rx="1" fill={colors.textSecondary} />
          <rect x="3" y="7" width="12" height="1" rx="0.5" fill={colors.textSecondary} />
          <rect x="3" y="10" width="14" height="1" rx="0.5" fill={colors.textSecondary} />
          <rect x="3" y="13" width="10" height="1" rx="0.5" fill={colors.textSecondary} />

          {/* Front newspaper */}
          <rect x="2" y="0" width="20" height="28" rx="2" fill={colors.frontPaper} />
          <rect x="4" y="2" width="16" height="2" rx="1" fill={colors.text} />
          <rect x="4" y="6" width="12" height="1" rx="0.5" fill={colors.text} />
          <rect x="4" y="9" width="14" height="1" rx="0.5" fill={colors.text} />
          <rect x="4" y="12" width="10" height="1" rx="0.5" fill={colors.text} />
          <rect x="4" y="15" width="8" height="1" rx="0.5" fill={colors.text} />
          <rect x="4" y="18" width="11" height="1" rx="0.5" fill={colors.text} />
        </g>

        {/* Connection lines representing aggregation */}
        <g stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" opacity="0.8">
          <line x1="8" y1="16" x2="12" y2="16" />
          <line x1="8" y1="20" x2="12" y2="20" />
          <line x1="8" y1="24" x2="12" y2="24" />
        </g>

        {/* Small news icons around the main logo */}
        <g transform="translate(36, 8)">
          <rect x="0" y="0" width="8" height="10" rx="1" fill="#3B82F6" opacity="0.3" />
          <rect x="1" y="1" width="6" height="1" rx="0.5" fill="#3B82F6" />
          <rect x="1" y="3" width="4" height="0.5" rx="0.25" fill="#3B82F6" />
          <rect x="1" y="4.5" width="5" height="0.5" rx="0.25" fill="#3B82F6" />
        </g>

        <g transform="translate(36, 22)">
          <rect x="0" y="0" width="8" height="10" rx="1" fill="#10B981" opacity="0.3" />
          <rect x="1" y="1" width="6" height="1" rx="0.5" fill="#10B981" />
          <rect x="1" y="3" width="4" height="0.5" rx="0.25" fill="#10B981" />
          <rect x="1" y="4.5" width="5" height="0.5" rx="0.25" fill="#10B981" />
        </g>

        <g transform="translate(36, 36)">
          <rect x="0" y="0" width="8" height="10" rx="1" fill="#F59E0B" opacity="0.3" />
          <rect x="1" y="1" width="6" height="1" rx="0.5" fill="#F59E0B" />
          <rect x="1" y="3" width="4" height="0.5" rx="0.25" fill="#F59E0B" />
          <rect x="1" y="4.5" width="5" height="0.5" rx="0.25" fill="#F59E0B" />
        </g>
      </svg>
    </div>
  );
}
