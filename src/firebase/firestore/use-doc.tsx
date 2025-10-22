'use client';

import { useState, useEffect } from 'react';
import {
  onSnapshot,
  type DocumentReference,
  type DocumentData,
} from 'firebase/firestore';

/**
 * A React hook for fetching and subscribing to a single Firestore document
 * in real-time.
 *
 * This hook simplifies the process of listening for changes to a document
 * and automatically updates your component's state with the latest data.
 * It handles setting up the snapshot listener and cleaning it up when the
 * component unmounts.
 *
 * @param ref - A Firestore `DocumentReference` object pointing to the document
 * you want to fetch. If `null` is provided, the hook will not fetch any data
 * and will return a `null` data state. It is recommended to memoize the
 * reference object to prevent re-renders.
 * @returns An object containing the `data` from the document, a `loading`
 * state, and any `error` that occurred.
 *
 * @example
 * ```tsx
 * import { useDoc } from '@/firebase/firestore/use-doc';
 * import { doc } from 'firebase/firestore';
 * import { useFirestore } from '@/firebase/provider';
 * import { useMemo } from 'react';
 *
 * function MyComponent({ documentId }) {
 *   const firestore = useFirestore();
 *
 *   const docRef = useMemo(() => {
 *     if (!firestore) return null;
 *     return doc(firestore, 'my-collection', documentId);
 *   }, [firestore, documentId]);
 *
 *   const { data, loading, error } = useDoc(docRef);
 *
 *   if (loading) {
 *     return <div>Loading document...</div>;
 *   }
 *
 *   if (error) {
 *     return <div>Error: {error.message}</div>;
 *   }
 *
 *   return (
 *     <div>
 *       <h1>{data?.title}</h1>
 *       <p>{data?.description}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function useDoc<T extends DocumentData>(
  ref: DocumentReference<T> | null
) {
  const [data, setData] = useState<(T & { id: string }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // If the reference is null, do nothing. This is useful for cases where
    // the reference depends on some other data that is not yet available.
    if (!ref) {
      setLoading(false);
      setData(null);
      return;
    }

    setLoading(true);

    const unsubscribe = onSnapshot(
      ref,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          setData({ id: docSnapshot.id, ...docSnapshot.data() } as T & { id: string });
        } else {
          setData(null); // Document does not exist
        }
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Error fetching document: ", err);
        setError(err);
        setLoading(false);
      }
    );

    // Cleanup the subscription on component unmount
    return () => unsubscribe();
  }, [ref]);

  return { data, loading, error };
}
