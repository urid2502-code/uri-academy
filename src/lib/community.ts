import { useCallback, useEffect, useMemo, useState } from 'react';

export type PostKind = 'thought' | 'question' | 'circle';

export interface PostComment {
  id: string;
  body: string;
  at: string;
}

export interface Post {
  id: string;
  kind: PostKind;
  /** The Socratic question a "circle" post answers. */
  prompt?: string;
  body: string;
  /** Lesson key such as "m3-l2", when the post is about a lesson. */
  lesson?: string;
  at: string;
  liked: boolean;
  comments: PostComment[];
}

export const POST_LIMIT = 1200;
const STORAGE_KEY = 'uri-academy:community:v1';
const KINDS: PostKind[] = ['thought', 'question', 'circle'];

const makeId = () => globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;

function isComment(value: unknown): value is PostComment {
  const item = value as PostComment;
  return !!item && typeof item.id === 'string' && typeof item.body === 'string' && typeof item.at === 'string';
}

function isPost(value: unknown): value is Post {
  const item = value as Post;
  return (
    !!item &&
    typeof item.id === 'string' &&
    KINDS.includes(item.kind) &&
    typeof item.body === 'string' &&
    typeof item.at === 'string' &&
    typeof item.liked === 'boolean' &&
    Array.isArray(item.comments) &&
    item.comments.every(isComment)
  );
}

function load(): Post[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    return Array.isArray(parsed) ? parsed.filter(isPost) : [];
  } catch {
    return [];
  }
}

export function useCommunity() {
  const [posts, setPosts] = useState<Post[]>(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    } catch {
      /* storage full or disabled: posts stay in memory for this visit */
    }
  }, [posts]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) setPosts(load());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const addPost = useCallback((input: Pick<Post, 'kind' | 'body' | 'prompt' | 'lesson'>) => {
    const body = input.body.trim().slice(0, POST_LIMIT);
    if (!body) return false;
    setPosts((current) => [{ id: makeId(), ...input, body, at: new Date().toISOString(), liked: false, comments: [] }, ...current]);
    return true;
  }, []);

  const toggleLike = useCallback((id: string) => {
    setPosts((current) => current.map((post) => (post.id === id ? { ...post, liked: !post.liked } : post)));
  }, []);

  const addComment = useCallback((id: string, text: string) => {
    const body = text.trim().slice(0, POST_LIMIT);
    if (!body) return false;
    setPosts((current) =>
      current.map((post) => (post.id === id ? { ...post, comments: [...post.comments, { id: makeId(), body, at: new Date().toISOString() }] } : post)),
    );
    return true;
  }, []);

  const removePost = useCallback((id: string) => setPosts((current) => current.filter((post) => post.id !== id)), []);

  return useMemo(() => ({ posts, addPost, toggleLike, addComment, removePost }), [posts, addPost, toggleLike, addComment, removePost]);
}
