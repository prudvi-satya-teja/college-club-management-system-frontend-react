import { getRoleBadgeColor, getRoleBadgeLabel } from '../../utils/roleUtils';

export default function Badge({ role, size = 'md' }) {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <span
      className={`inline-block text-white rounded-full font-semibold ${getRoleBadgeColor(role)} ${sizeClasses[size]}`}
    >
      {getRoleBadgeLabel(role)}
    </span>
  );
}
