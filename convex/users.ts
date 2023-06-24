import type { UserIdentity } from 'convex/server';
import { query } from './_generated/server';

export const auth = query(async ({ auth }): Promise<UserIdentity | null> => {
  const identity = await auth.getUserIdentity();
  return identity;
});

