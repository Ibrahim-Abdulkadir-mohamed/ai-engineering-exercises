import { cache } from 'react';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export const getSessionCached = cache(async () => {
  return await auth.api.getSession({
    headers: await headers(),
  });
});