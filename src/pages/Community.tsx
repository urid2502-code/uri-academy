import { CircleHelp, Heart, Lightbulb, MessageCircle, MessagesSquare, Trash2, type LucideIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useId, useState, type FormEvent } from 'react';
import { SlidingTabs } from '../components/Tabs';
import { allLessons, findLesson, modules } from '../content';
import { POST_LIMIT, useCommunity, type Post, type PostKind } from '../lib/community';
import { EASE_OUT } from '../lib/motion';
import { href } from '../lib/router';

const KIND_META: Record<PostKind, { label: string; icon: LucideIcon; placeholder: string }> = {
  thought: { label: 'מחשבה', icon: Lightbulb, placeholder: 'מה הבנת היום, או מה שינה לך את הדרך שבה אתה חושב על קוד?' },
  question: { label: 'שאלה', icon: CircleHelp, placeholder: 'על מה אתה תקוע? פירוט קצר עוזר לך לנסח את הבעיה, וגם לפתור אותה.' },
  circle: { label: 'Socratic Circle', icon: MessagesSquare, placeholder: 'ענה על השאלה במילים שלך. אחר כך הוסף שאלות המשך: ולמה?' },
};

const SOCRATIC_PROMPTS = [
  'איך הייתי מסביר את זה למי שמתחיל מאפס, בלי מילים מקצועיות?',
  'איזו הנחה עומדת מאחורי הפתרון הזה, ומה קורה אם היא לא נכונה?',
  'איפה זה היה נשבר אם העומס היה גדל פי 100?',
  'איזו אלטרנטיבה שקלתי, ולמה ויתרתי עליה?',
  'מה הדבר הכי קטן שאפשר לבדוק כדי לדעת שהבנתי נכון?',
  'אילו תקלות אפשריות כאן, ואיך אדע שהן קרו?',
];

const FILTERS: { id: 'all' | PostKind; label: string }[] = [
  { id: 'all', label: 'הכל' },
  { id: 'thought', label: 'מחשבות' },
  { id: 'question', label: 'שאלות' },
  { id: 'circle', label: 'Socratic Circles' },
];

const formatter = new Intl.DateTimeFormat('he-IL', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
const when = (iso: string) => {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? '' : formatter.format(date);
};

export function Community() {
  const { posts, addPost, toggleLike, addComment, removePost } = useCommunity();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]['id']>('all');
  const visible = filter === 'all' ? posts : posts.filter((post) => post.kind === filter);

  return (
    <div className="course-page community-page">
      <header className="community-header">
        <h1>Thought Streams</h1>
        <p>המרחב שלך לחשיבה בקול רם: מחשבות, שאלות ו-Socratic Circles. הכול נשמר במכשיר הזה בלבד, בלי חשבון ובלי שרת.</p>
      </header>

      <Composer onSubmit={addPost} />

      <SlidingTabs
        mode="filter"
        idBase="posts"
        ariaLabel="סינון הפוסטים"
        className="community-filters"
        value={filter}
        onChange={(id) => setFilter(id as (typeof FILTERS)[number]['id'])}
        items={FILTERS.map((item) => ({ id: item.id, label: item.label, count: item.id === 'all' ? posts.length : posts.filter((post) => post.kind === item.id).length }))}
      />

      {visible.length === 0 ? (
        <div className="community-empty">
          <p>{posts.length === 0 ? 'עוד אין פוסטים.' : 'אין פוסטים בקטגוריה הזו.'}</p>
          <span>{posts.length === 0 ? 'התחל במחשבה אחת על מה שלמדת היום, או בחר Socratic Circle וענה על שאלה.' : 'בחר קטגוריה אחרת או כתוב פוסט חדש.'}</span>
        </div>
      ) : (
        <ol className="community-feed">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((post) => (
              <motion.li
                key={post.id}
                layout
                initial={{ opacity: 0, y: -12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.32, ease: EASE_OUT }}
              >
                <PostCard post={post} onLike={() => toggleLike(post.id)} onComment={(text) => addComment(post.id, text)} onRemove={() => removePost(post.id)} />
              </motion.li>
            ))}
          </AnimatePresence>
        </ol>
      )}
    </div>
  );
}

function Composer({ onSubmit }: { onSubmit: (input: Pick<Post, 'kind' | 'body' | 'prompt' | 'lesson'>) => boolean }) {
  const id = useId();
  const [kind, setKind] = useState<PostKind>('thought');
  const [prompt, setPrompt] = useState(SOCRATIC_PROMPTS[0]);
  const [body, setBody] = useState('');
  const [lesson, setLesson] = useState('');

  function submit(event: FormEvent) {
    event.preventDefault();
    if (onSubmit({ kind, body, prompt: kind === 'circle' ? prompt : undefined, lesson: lesson || undefined })) {
      setBody('');
      setLesson('');
    }
  }

  return (
    <form className="community-composer" onSubmit={submit}>
      <SlidingTabs
        mode="filter"
        variant="segmented"
        idBase="kind"
        ariaLabel="סוג הפוסט"
        className="community-kinds"
        value={kind}
        onChange={(id) => setKind(id as PostKind)}
        items={(Object.keys(KIND_META) as PostKind[]).map((item) => {
          const Icon = KIND_META[item].icon;
          return { id: item, label: KIND_META[item].label, icon: <Icon className="h-4 w-4" /> };
        })}
      />
      {kind === 'circle' && (
        <div className="mt-4">
          <label htmlFor={`${id}-prompt`} className="text-[12px] text-faint">שאלה לדיון</label>
          <select id={`${id}-prompt`} value={prompt} onChange={(event) => setPrompt(event.target.value)} className="community-select mt-1 w-full">
            {SOCRATIC_PROMPTS.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
      )}
      <label htmlFor={`${id}-body`} className="sr-only">תוכן הפוסט</label>
      <textarea
        id={`${id}-body`}
        value={body}
        maxLength={POST_LIMIT}
        onChange={(event) => setBody(event.target.value)}
        placeholder={KIND_META[kind].placeholder}
        className="community-textarea"
      />
      <div className="community-composer-footer">
        <div className="min-w-0 flex-1">
          <label htmlFor={`${id}-lesson`} className="sr-only">שיעור קשור</label>
          <select id={`${id}-lesson`} value={lesson} onChange={(event) => setLesson(event.target.value)} className="community-select w-full">
            <option value="">ללא שיעור מקושר</option>
            {modules.map((module) => (
              <optgroup key={module.id} label={module.short}>
                {module.lessons.map((item) => <option key={item.id} value={`${module.id}-${item.id}`}>{item.title}</option>)}
              </optgroup>
            ))}
          </select>
        </div>
        <span className="tabular text-[12px] text-faint">{body.length}/{POST_LIMIT}</span>
        <button type="submit" disabled={!body.trim()} className="btn-ice">פרסום</button>
      </div>
    </form>
  );
}

function PostCard({ post, onLike, onComment, onRemove }: { post: Post; onLike: () => void; onComment: (text: string) => boolean; onRemove: () => void }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [confirming, setConfirming] = useState(false);
  const meta = KIND_META[post.kind];
  const Icon = meta.icon;
  const linked = post.lesson ? allLessons.find((item) => item.key === post.lesson) : undefined;
  const lessonTarget = linked ? findLesson(linked.module.id, linked.lesson.id) : null;

  function submitComment(event: FormEvent) {
    event.preventDefault();
    if (onComment(draft)) setDraft('');
  }

  return (
    <article className="community-post">
      <div className="community-post-meta">
        <span className="community-kind"><Icon className="h-3.5 w-3.5" />{meta.label}</span>
        <time dateTime={post.at}>{when(post.at)}</time>
      </div>
      {post.prompt && <p className="community-prompt">{post.prompt}</p>}
      <p dir="auto" className="community-body">{post.body}</p>
      {lessonTarget && (
        <a className="community-lesson" href={href.lesson(lessonTarget.module.id, lessonTarget.lesson.id)}>
          שיעור: {lessonTarget.lesson.title}
        </a>
      )}
      <div className="community-actions">
        <button onClick={onLike} aria-pressed={post.liked} aria-label={post.liked ? 'הסר סימון' : 'סמן כחשוב'} className={post.liked ? 'is-liked' : ''}>
          <Heart className="h-4 w-4" fill={post.liked ? 'currentColor' : 'none'} />
          <span className="tabular">{post.liked ? 1 : 0}</span>
        </button>
        <button onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls={`${id}-comments`}>
          <MessageCircle className="h-4 w-4" />
          <span className="tabular">{post.comments.length}</span>
          <span className="sr-only">תגובות</span>
        </button>
        <span className="flex-1" />
        {confirming ? (
          <>
            <button onClick={onRemove} className="text-rose-400">למחוק</button>
            <button onClick={() => setConfirming(false)}>ביטול</button>
          </>
        ) : (
          <button onClick={() => setConfirming(true)} aria-label="מחיקת הפוסט"><Trash2 className="h-4 w-4" /></button>
        )}
      </div>
      {open && (
        <div id={`${id}-comments`} className="community-comments">
          {post.comments.map((comment) => (
            <p key={comment.id} dir="auto"><span>{comment.body}</span><time dateTime={comment.at}>{when(comment.at)}</time></p>
          ))}
          <form onSubmit={submitComment}>
            <label htmlFor={`${id}-comment`} className="sr-only">הוספת תגובה</label>
            <input
              id={`${id}-comment`}
              value={draft}
              maxLength={POST_LIMIT}
              onChange={(event) => setDraft(event.target.value)}
              placeholder={post.kind === 'circle' ? 'שאלת המשך: ולמה?' : 'הוסף תגובה'}
            />
            <button type="submit" disabled={!draft.trim()}>שליחה</button>
          </form>
        </div>
      )}
    </article>
  );
}
