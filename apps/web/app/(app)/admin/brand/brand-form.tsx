'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { saveBrandVoiceAction, type BrandVoiceState } from './actions';

interface Props {
  initial: {
    voice: string;
    language: string;
    formality: string;
    signature: string;
    forbiddenPhrases: string;
    requiredPhrases: string;
    emojiPolicy: string;
    customInstructions: string;
  };
}

export function BrandVoiceForm({ initial }: Props) {
  const [state, formAction, pending] = useActionState<BrandVoiceState, FormData>(
    saveBrandVoiceAction,
    null,
  );

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="voice">Voice</Label>
          <select
            id="voice"
            name="voice"
            defaultValue={initial.voice}
            className="block w-full rounded-md border border-hairline bg-paper px-3 py-2 text-sm"
          >
            <option value="friendly">Friendly</option>
            <option value="formal">Formal</option>
            <option value="casual">Casual</option>
            <option value="playful">Playful</option>
            <option value="serious">Serious</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="language">Default language</Label>
          <select
            id="language"
            name="language"
            defaultValue={initial.language}
            className="block w-full rounded-md border border-hairline bg-paper px-3 py-2 text-sm"
          >
            <option value="th">Thai</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="formality">Formality</Label>
          <select
            id="formality"
            name="formality"
            defaultValue={initial.formality}
            className="block w-full rounded-md border border-hairline bg-paper px-3 py-2 text-sm"
          >
            <option value="polite">Polite (ค่ะ/ครับ)</option>
            <option value="casual">Casual</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="emojiPolicy">Emoji</Label>
          <select
            id="emojiPolicy"
            name="emojiPolicy"
            defaultValue={initial.emojiPolicy}
            className="block w-full rounded-md border border-hairline bg-paper px-3 py-2 text-sm"
          >
            <option value="none">None</option>
            <option value="sparing">Sparing (end of message)</option>
            <option value="friendly">Friendly (warmth allowed)</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="signature">Sign-off</Label>
        <Input
          id="signature"
          name="signature"
          defaultValue={initial.signature}
          placeholder="ทีม FlowAIOS"
        />
        <p className="text-xs text-mute">
          Optional. Appended to closing replies when relevant.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="forbiddenPhrases">Forbidden phrases</Label>
        <Input
          id="forbiddenPhrases"
          name="forbiddenPhrases"
          defaultValue={initial.forbiddenPhrases}
          placeholder="never use, also forbidden, comma separated"
        />
        <p className="text-xs text-mute">
          Comma-separated. Up to 12. AI is told never to use these.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="requiredPhrases">Required / preferred phrases</Label>
        <Input
          id="requiredPhrases"
          name="requiredPhrases"
          defaultValue={initial.requiredPhrases}
          placeholder="ขอบคุณค่ะ, ขออนุญาตเช็คให้นะคะ"
        />
        <p className="text-xs text-mute">
          Comma-separated. AI tries to use these when relevant.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="customInstructions">Custom instructions</Label>
        <textarea
          id="customInstructions"
          name="customInstructions"
          defaultValue={initial.customInstructions}
          rows={4}
          className="block w-full rounded-md border border-hairline bg-paper px-3 py-2 text-sm"
          placeholder="Free-form instructions: 'Always offer free shipping mention for orders ≥ ฿800.'"
        />
      </div>

      {state?.error && <p className="text-sm text-rose">{state.error}</p>}
      {state?.ok && <p className="text-sm text-mint">Saved.</p>}

      <Button type="submit" disabled={pending}>
        {pending ? 'Saving…' : 'Save brand voice'}
      </Button>
    </form>
  );
}
