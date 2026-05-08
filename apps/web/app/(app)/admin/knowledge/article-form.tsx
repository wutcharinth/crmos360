'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createArticleAction, updateArticleAction, type ArticleState } from './actions';

interface BaseProps {
  initial?: { title: string; body: string; category: string };
}

interface CreateProps extends BaseProps {
  mode: 'create';
  articleId?: undefined;
}

interface EditProps extends BaseProps {
  mode: 'edit';
  articleId: string;
}

type Props = CreateProps | EditProps;

export function ArticleForm(props: Props) {
  const action = props.mode === 'create'
    ? createArticleAction
    : updateArticleAction.bind(null, props.articleId);

  const [state, formAction, pending] = useActionState<ArticleState, FormData>(action, null);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          defaultValue={props.initial?.title}
          required
          placeholder="e.g. ค่าจัดส่งและระยะเวลา"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category (optional)</Label>
        <Input
          id="category"
          name="category"
          defaultValue={props.initial?.category}
          placeholder="shipping, returns, faq, sop…"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="body">Body</Label>
        <textarea
          id="body"
          name="body"
          defaultValue={props.initial?.body}
          required
          rows={10}
          className="block w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-warm/30"
          placeholder="Write the article. AI will use it when answering customer questions."
        />
      </div>

      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      {state?.ok && <p className="text-sm text-mint">Saved.</p>}

      <Button type="submit" disabled={pending}>
        {pending ? 'Saving…' : props.mode === 'create' ? 'Create article' : 'Save changes'}
      </Button>
    </form>
  );
}
