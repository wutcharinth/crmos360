'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  createProductAction,
  updateProductAction,
  type ProductState,
} from './actions';

interface BaseProps {
  initial?: {
    sku: string;
    name: string;
    description: string;
    price: string;
    currency: string;
    inStock: boolean;
  };
}

interface CreateProps extends BaseProps {
  mode: 'create';
  productId?: undefined;
}

interface EditProps extends BaseProps {
  mode: 'edit';
  productId: string;
}

type Props = CreateProps | EditProps;

export function ProductForm(props: Props) {
  const action =
    props.mode === 'create'
      ? createProductAction
      : updateProductAction.bind(null, props.productId);

  const [state, formAction, pending] = useActionState<ProductState, FormData>(action, null);
  const init = props.initial;

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" defaultValue={init?.name} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sku">SKU</Label>
          <Input id="sku" name="sku" defaultValue={init?.sku} placeholder="LB-2024-OAT" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          name="description"
          defaultValue={init?.description}
          rows={6}
          className="block w-full rounded-md border border-hairline bg-paper px-3 py-2 text-sm"
          placeholder="Material, sizing, ingredients, what's in the box…"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input id="price" name="price" type="number" step="0.01" defaultValue={init?.price} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="currency">Currency</Label>
          <Input id="currency" name="currency" defaultValue={init?.currency ?? 'THB'} />
        </div>
        <div className="flex items-end pb-2">
          <Label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="inStock"
              defaultChecked={init?.inStock ?? true}
              className="h-4 w-4"
            />
            In stock
          </Label>
        </div>
      </div>

      {state?.error && <p className="text-sm text-rose">{state.error}</p>}
      {state?.ok && <p className="text-sm text-mint">Saved.</p>}

      <Button type="submit" disabled={pending}>
        {pending ? 'Saving…' : props.mode === 'create' ? 'Create product' : 'Save changes'}
      </Button>
    </form>
  );
}
