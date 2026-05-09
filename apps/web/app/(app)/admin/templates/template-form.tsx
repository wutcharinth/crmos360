'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  createTemplateAction,
  updateTemplateAction,
  type TemplateState,
} from './actions';

interface BaseProps {
  initial?: {
    shortcut: string;
    title: string;
    body: string;
    language: string;
    category: string;
  };
}

interface CreateProps extends BaseProps {
  mode: 'create';
  templateId?: undefined;
}

interface EditProps extends BaseProps {
  mode: 'edit';
  templateId: string;
}

type Props = CreateProps | EditProps;

export function TemplateForm(props: Props) {
  const action =
    props.mode === 'create'
      ? createTemplateAction
      : updateTemplateAction.bind(null, props.templateId);

  const [state, formAction, pending] = useActionState<TemplateState, FormData>(action, null);
  const init = props.initial;

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" defaultValue={init?.title} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="shortcut">Shortcut (optional)</Label>
          <Input
            id="shortcut"
            name="shortcut"
            defaultValue={init?.shortcut}
            placeholder="thanks-shipping"
          />
          <p className="text-xs text-mute">Type /{init?.shortcut || 'shortcut'} in composer.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            name="category"
            defaultValue={init?.category}
            placeholder="shipping, returns, faq, after-sale"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="language">Language</Label>
          <select
            id="language"
            name="language"
            defaultValue={init?.language ?? 'th'}
            className="block w-full rounded-md border border-hairline bg-paper px-3 py-2 text-sm"
          >
            <option value="th">Thai</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="body">Body</Label>
        <textarea
          id="body"
          name="body"
          defaultValue={init?.body}
          required
          rows={6}
          className="block w-full rounded-md border border-hairline bg-paper px-3 py-2 text-sm"
          placeholder="The reply text. Variables like {customer_name} not yet supported."
        />
      </div>

      {state?.error && <p className="text-sm text-rose">{state.error}</p>}
      {state?.ok && <p className="text-sm text-mint">Saved.</p>}

      <Button type="submit" disabled={pending}>
        {pending ? 'Saving…' : props.mode === 'create' ? 'Create template' : 'Save changes'}
      </Button>
    </form>
  );
}
