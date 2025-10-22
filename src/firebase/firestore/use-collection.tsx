'use client';

import { useState, useEffect } from 'react';
import {
  onSnapshot,
  query,
  collection,
  where,
  type Firestore,
  type DocumentData,
  type Query,
  type CollectionReference,
} from 'firebase/firestore';

/**
 * A React hook for fetching and subscribing to a Firestore collection in
 * real-time.
 *
 * This hook simplifies the process of listening for changes to a collection
 * and automatically updates your component's state with the latest data.
 * It handles setting up the snapshot listener and cleaning it up when the
 * component unmounts.
 *
 * @param query - A Firestore `Query` or `CollectionReference` object. The hook
 * will listen to the documents that match this query. If `null` is provided,
 * the hook will not fetch any data and will return a `null` data state.
 * @returns An object containing the `data` from the collection, a `loading`
 * state, and any `error` that occurred.
 *
 * @example
 * ```tsx
 * import { useCollection } from '@/firebase/firestore/use-collection';
 * import { collection, query, where } from 'firebase/firestore';
 * import { useFirestore } from '@/firebase/provider';
 *
 * function MyComponent() {
 *   const firestore = useFirestore();
 *   const [showCompleted, setShowCompleted] = useState(false);
 *
 *   const tasksQuery = firestore
 *     ? query(
 *         collection(firestore, 'tasks'),
 *         where('completed', '==', showCompleted)
 *       )
 *     : null;
 *
 *   const { data: tasks, loading, error } = useCollection(tasksQuery);
 *
 *   if (loading) {
 *     return <div>Loading tasks...</div>;
 *   }
 *
 *   if (error) {
 *     return <div>Error: {error.message}</div>;
 *   }
 *
 *   return (
 *     <ul>
 *       {tasks?.map(task => (
 *         <li key={task.id}>{task.title}</li>
 *       ))}
     </ul>
 *   );
 * }
 * ```
 */
export function useCollection<T extends DocumentData>(
  query: Query<T> | CollectionReference<T> | null
) {
  const [data, setData] = useState<(T & { id: string })[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // If the query is null, do nothing. This is useful for cases where the
    // query depends on some other data that is not yet available.
    if (!query) {
      setLoading(false);
      setData(null);
      return;
    }

    setLoading(true);

    const unsubscribe = onSnapshot(
      query,
      (querySnapshot) => {
        const docs = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(docs as (T & { id: string })[]);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Error fetching collection: ", err);
        setError(err);
        setLoading(false);
      }
    );

    // Cleanup the subscription on component unmount
    return () => unsubscribe();
  }, [query]);

  return { data, loading, error };
}
