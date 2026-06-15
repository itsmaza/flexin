'use client';

import { useCartStore } from '@/hook/persist';
import { useAddressStore } from '@/hook/useAddressStore';
import React, {   useMemo } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckoutFormValues, checkoutSchema } from '@/schema/order';
import { orderProcess } from '@/server/controllers/order';

import AppError, { globalErrorMessage } from '@/server/responce/error';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Address from './Address';
import { useAuthStore } from '@/hook/auth';

import { useNotificationStore } from '@/hook/notification';
import Link from 'next/link';
import { formatPrice } from '@/utils';


export default function BetterCheckout() {
  const cartStore = useCartStore();
  const items = cartStore.cart;
  const router = useRouter();
  const addresses = useAddressStore((pre) => pre.totalAddress);
  const userInfo = useAuthStore((pre) => pre.user);

  const notificationStore = useNotificationStore();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting, isValid },
  } = useForm<CheckoutFormValues>({
    mode: 'onChange',
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      phone: '',
      shipping: 'standard',
      payment: 'CASH_ON_DELIVERY',
      agreed: false,
    },
  });

  const shipping = watch('shipping');
  const payment = watch('payment');

  const subtotal = useMemo(
    () => items.reduce((s, it) => s + it.price * it.quantity, 0),
    [items]
  );
  const shippingFee = shipping === 'express' ? 7 : 0;
  const total = Math.max(0, subtotal + shippingFee);

  const onSubmit = async (data: CheckoutFormValues) => {
    try {

    
      if (Object.values(addresses).includes(''))
        throw new AppError({ message: 'Invalid address' });
      // intregrate mazapay api
      if(data.payment=="MAZAPAY"){
        alert("ami asi")
      }
  
      const addOrder = (await orderProcess({
        userInfo: {
          email: userInfo?.email || '',
          name: userInfo?.name,
          phone: data.phone
        },
        OrderItems: [...items],
        address: addresses,
        Payment: { paymentMethod: data.payment as paymentMethod },
      })) as {
        status: number;
        message: string;
        data: {
          orderID: string;
        };
      };

      if (addOrder.status !== 200) {
        throw new AppError({ message: addOrder.message });
      }

      //set notification
      notificationStore.setNotification({
        title: 'Order Placed',
        body: `Your order ${addOrder.data.orderID} has been placed successfully.`,
        read: false,
        href: `/order/status`,
      });

      //success toast message
      toast.success('Successfully placed order');
      //redirect to order status page
      router.replace('/order/status/'+addOrder.data.orderID);

      //clear cart
      cartStore.clearCart();
    
    } catch (error) {
      const errMsg = globalErrorMessage(error);
      toast.error(errMsg);
    }
  };


  type paymentMethod = 'CASH_ON_DELIVERY' | 'BKASH' | 'MAZAPAY';

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="text-center text-gray-500">
          Your cart is empty. Please add some products to proceed to checkout.{' '}
          <Link href={'/products'} className="text-blue-400">
            Go to store
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      {/* Progress header */}
      <ol className="mb-8 md:flex items-center gap-4 text-sm hidden">
        {[
          ['Cart', items.length > 0],
          ['Address', Object.values(addresses).every(Boolean)],
          ['Payment', true],
          ['Review', watch('agreed')],
        ].map(([label, done], i) => (
          <li key={i} className="flex items-center gap-2">
            <span
              className={[
                'grid h-6 w-6 place-items-center rounded-full border border-gray-100 text-xs',
                done
                  ? 'bg-gray-600 text-white border-gray-600'
                  : 'border-gray-300 text-gray-500',
              ].join(' ')}
            >
              {i + 1}
            </span>
            <span className={done ? 'font-medium' : 'text-gray-500'}>
              {label}
            </span>
            {i < 3 && <span className="mx-2 h-px w-8 bg-gray-200" />}
          </li>
        ))}
      </ol>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Left: Forms */}
        <section className="lg:col-span-2 space-y-6">
          {/* Customer Info */}
          <Card>
            <CardHeader
              title="Customer Information"
              subtitle="We’ll use this for order updates."
            />
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Full name" required>
                <Input value={userInfo?.name || 'unknown'} disabled />
              </Field>
              <Field
                label="Email"
                required
                hint="We’ll send confirmation here."
              >
                <Input
                  type="email"
                  value={userInfo?.email || 'user@gmail.com'}
                  disabled
                />
              </Field>
              <Field label="Phone" required>
                <Input placeholder="+8801XXXXXXXXX" {...register('phone')} />
                <ErrorText msg={errors.phone?.message} />
              </Field>
              <div />
            </div>
          </Card>

          {/* Address */}
          <Card>
            <CardHeader title="Shipping Address" />
            <Address />
          </Card>

          {/* Shipping */}
          <Card>
            <CardHeader title="Delivery Method" />
            <div className="grid gap-3">
              <RadioRow
                name="shipping"
                title="Standard (2–4 days)"
                right="Free"
                desc="Best value — delivered by courier."
                checked={shipping === 'standard'}
                onChange={() =>
                  setValue('shipping', 'standard', {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
              />
              {/* <RadioRow
                name="shipping"
                title="Express (1–2 days)"
                right="$7"
                desc="Fast delivery with priority handling."
                checked={shipping === 'express'}
                onChange={() =>
                  setValue('shipping', 'express', {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
              /> */}
            </div>
          </Card>

          {/* Payment */}
          <Card>
            <CardHeader title="Payment" subtitle="Select a payment method." />
            <div className="grid gap-3">
              {['CASH_ON_DELIVERY', 'BKASH', 'MAZAPAY'].map((method) => (
                <RadioRow
                  key={method}
                  name="payment"
                  title={
                    method === 'CASH_ON_DELIVERY'
                      ? 'Cash on Delivery'
                      : method === 'BKASH'
                      ? 'bKash'
                      : 'MazaPay Wallet'
                  }
                  desc={
                    method === 'CASH_ON_DELIVERY'
                      ? 'Pay in cash when you receive the package.'
                      : method === 'BKASH'
                      ? 'Pay via bKash wallet.'
                      : 'We accept Visa, Mastercard and Amex.'
                  }
                  leftBadge={method === 'BKASH' ? 'Recommended' : undefined}
                  checked={payment === method}
                  onChange={() =>
                    setValue('payment', method  as paymentMethod, {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                />
              ))}
            </div>
          </Card>

          {/* Terms */}
          <Card>
            <div className="flex items-start gap-3">
              <input
                id="agree"
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-gray-300 cursor-pointer"
                {...register('agreed')}
              />
              <Label htmlFor="agree" className="text-sm text-gray-700">
                I agree to the{' '}
                <a className="underline hover:no-underline" href="#">
                  Terms & Conditions
                </a>{' '}
                and{' '}
                <a className="underline hover:no-underline" href="#">
                  Privacy Policy
                </a>
                .
              </Label>
            </div>
            <ErrorText msg={errors.agreed?.message} />
          </Card>
        </section>

        {/* Right: Summary */}
        <aside className="lg:sticky lg:top-8 h-fit">
          <Card>
            <CardHeader title="Order Summary" />
            <div className="space-y-4">
              <ul className="divide-y divide-gray-200/70">
                {items.map((it) => (
                  <li key={it.id} className="flex gap-3 py-3">
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-100 bg-gray-50">
                      <Image
                        src={it.imageUrl}
                        alt={it.name}
                        className="h-full w-full object-cover"
                        width={100}
                        height={100}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{it.name}</p>
                      <div className="flex items-center gap-2">
                        {it.color && (
                          <p className="text-xs text-gray-500">{it.color}</p>
                        )}
                        {it.size && (
                          <p className="text-xs text-gray-500 uppercase">
                            {it.size}
                          </p>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Qty: {it.quantity}
                      </p>
                    </div>
                    <div className="text-sm font-medium">
                      {formatPrice(it.price * it.quantity)}
                    </div>
                  </li>
                ))}
              </ul>

              <div className="space-y-2 text-sm">
                <Row label="Subtotal" value={`${formatPrice(subtotal)}`} />
                <Row
                  label="Shipping"
                  value={
                    shippingFee === 0 ? 'Free' : `${formatPrice(shippingFee)}`
                  }
                />
                <div className="border-t border-gray-200 pt-2 font-semibold flex items-center justify-between">
                  <span>Total</span>
                  <span className="text-lg">{formatPrice(total)}</span>
                </div>
              </div>

              <Button
                variant="default"
                type="submit"
                disabled={!isValid || isSubmitting || items.length === 0}
                className={`btn-primary w-full ${
                  !isValid ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
                }`}
              >
                {isSubmitting ? 'Placing…' : 'Place Order'}
              </Button>
              <p className="text-center text-xs text-gray-500">
                🔒 Secure checkout • 24/7 support
              </p>
            </div>
          </Card>
        </aside>
      </form>
    </main>
  );
}

/* ---------- UI primitives ---------- */

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-2xl shadow-gray-100 dark:border-gray-800 dark:bg-gray-900">
      {children}
    </div>
  );
}

function CardHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-base font-semibold">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
    </div>
  );
}

function Field({
  label,
  children,
  required,
  hint,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium">
        {label} {required && <span className="text-rose-600">*</span>}
      </span>
      <div className="relative">{children}</div>
      {hint && <span className="mt-1 block text-xs text-gray-500">{hint}</span>}
    </label>
  );
}

function RadioRow({
  name,
  title,
  desc,
  right,
  leftBadge,
  checked,
  onChange,
}: {
  name: string;
  title: string;
  desc?: string;
  right?: string;
  leftBadge?: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label
      className={`flex items-start justify-between gap-3 rounded-xl border p-3 transition ${
        checked
          ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-900/10'
          : 'border-gray-200 hover:bg-gray-50'
      }`}
    >
      <div className="flex items-start gap-3">
        <input
          type="radio"
          name={name}
          checked={checked}
          onChange={onChange}
          className="mt-1 h-4 w-4"
        />
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">{title}</p>
            {leftBadge && (
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-medium text-blue-700">
                {leftBadge}
              </span>
            )}
          </div>
          {desc && <p className="mt-0.5 text-xs text-gray-500">{desc}</p>}
        </div>
      </div>
      {right && <p className="text-sm font-medium">{right}</p>}
    </label>
  );
}

function Row({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span
        className={`text-sm ${highlight ? 'text-rose-600' : 'text-gray-600'}`}
      >
        {label}
      </span>
      <span
        className={`text-sm ${highlight ? 'text-rose-600' : 'text-gray-900'}`}
      >
        {value}
      </span>
    </div>
  );
}

function ErrorText({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-1 text-xs text-rose-600">{msg}</p>;
}
