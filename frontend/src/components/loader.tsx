import { HiOutlineRefresh } from 'react-icons/hi';

interface LoaderProps {
  className?: string;
}

export default function Loader({ className = '' }: LoaderProps) {
  return <HiOutlineRefresh className={`animate-spin h-5 w-5 text-blue-600 ${className}`} />;
}
