"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth-context';
import { getSupplierContext } from '@/lib/team';
import type { TeamRole } from '@/lib/types';

export type Permission =
  | 'all'
  | 'products'
  | 'stock'
  | 'orders'
  | 'team'
  | 'finance'
  | 'view';

const ROLE_PERMISSIONS: Record<TeamRole, Permission[]> = {
  owner:           ['all', 'products', 'stock', 'orders', 'team', 'finance', 'view'],
  manager:         ['products', 'stock', 'orders', 'team', 'view'],
  orders_manager:  ['orders', 'view'],
  stock_manager:   ['stock', 'view'],
  product_manager: ['products', 'view'],
  finance_manager: ['finance', 'view'],
  viewer:          ['view'],
};

interface TeamPermissions {
  supplierId: string | null;
  teamRole: TeamRole | null;
  loading: boolean;
  can: (permission: Permission) => boolean;
  isOwner: boolean;
  isOwnerOrManager: boolean;
}

export function useTeamPermissions(): TeamPermissions {
  const { user } = useAuth();
  const [supplierId, setSupplierId] = useState<string | null>(null);
  const [teamRole, setTeamRole] = useState<TeamRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    getSupplierContext(user.id).then((ctx) => {
      if (cancelled) return;
      if (ctx) {
        setSupplierId(ctx.supplierId);
        setTeamRole(ctx.teamRole);
      }
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [user]);

  const can = useCallback(
    (permission: Permission): boolean => {
      if (!teamRole) return false;
      const perms = ROLE_PERMISSIONS[teamRole];
      return perms.includes('all') || perms.includes(permission);
    },
    [teamRole]
  );

  return {
    supplierId,
    teamRole,
    loading,
    can,
    isOwner: teamRole === 'owner',
    isOwnerOrManager: teamRole === 'owner' || teamRole === 'manager',
  };
}
