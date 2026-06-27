import { TEAM_ROLES } from '@/lib/constants';
import type { TeamRole } from '@/lib/types';

interface Props {
  role: TeamRole;
  size?: 'sm' | 'md';
}

export function TeamRoleBadge({ role, size = 'sm' }: Props) {
  const config = TEAM_ROLES[role];
  if (!config) return null;

  return (
    <span
      className={`inline-flex items-center gap-1 border rounded-full font-medium
        ${config.color}
        ${size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-3 py-1'}
      `}
    >
      {config.label}
    </span>
  );
}
