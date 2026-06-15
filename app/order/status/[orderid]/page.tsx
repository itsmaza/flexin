'use client';
import {
  CheckCircle2,
  ReceiptText,
  Truck,
  ArrowRight,
  CreditCard,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getEstimatedDelivery } from '@/utils/algorithm';
import { getorderDatawithOrderId } from '@/server/controllers/order';
import { useEffect, useState } from 'react';
import {  PaymentMethod, PaymentStatus } from '@prisma/client';
import { useParams } from 'next/navigation';
import { useAuthStore } from '@/hook/auth';
import AppError from '@/server/responce/error';
import { Loader } from '@/app/__global_components/Loader';

export type PaymentInfo = {
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
};

export type OrderData = {
  orderID: string;
  createdAt?: string;
  total: number;
  currency?: string;
  status: string;
  Payments: PaymentInfo;
  estimatedDelivery?: string;
};

// Confetti burst
const ConfettiBurst: React.FC = () => {
  const pieces = Array.from({ length: 18 });
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <AnimatePresence>
        {pieces.map((_, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 0, x: 0, scale: 0.6 }}
            animate={{
              opacity: [0, 1, 0],
              y: [-10, -120 - (i % 6) * 15],
              x: [(i - 9) * 12, (i - 9) * 22],
              rotate: (i % 2 === 0 ? 1 : -1) * (120 + i * 10),
              scale: [0.6, 1, 0.6],
            }}
            transition={{ duration: 1.4, ease: 'easeOut', delay: i * 0.02 }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

// Badge helper
const Badge: React.FC<{
  children: React.ReactNode;
  tone?: 'green' | 'amber' | 'red' | 'gray';
}> = ({ children, tone = 'green' }) => {
  const tones: Record<string, string> = {
    green: 'bg-green-100 text-green-700 border-green-200',
    amber: 'bg-amber-100 text-amber-700 border-amber-200',
    red: 'bg-red-100 text-red-700 border-red-200',
    gray: 'bg-gray-100 text-gray-700 border-gray-200',
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
};

export default function Page() {
  const [orderInfo, setOrderInfo] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(false);

  const allParam = useParams<{ orderid: string }>();
  const { user } = useAuthStore();
  const userEmail = user?.email ?? '';

  useEffect(() => {
    if (!allParam?.orderid || !userEmail) return;
    setLoading(true);

    const getOrderInfo = async () => {
      try {
        const res = await getorderDatawithOrderId(allParam.orderid, userEmail);
        if (res.status !== 200)
          throw new AppError({
            message: res.message,
          });
        setOrderInfo(res.data as OrderData);
      } catch {
        setOrderInfo(null);
      } finally {
        setLoading(false);
      }
    };
    getOrderInfo();
  }, [allParam?.orderid, userEmail]);

  if (loading)
    return (
      <main className="text-center py-20 text-gray-600">
        <Loader />
      </main>
    );

  return (
    <>
      {orderInfo ? (
        <div className="w-full max-w-5xl mx-auto px-4 py-10">
          <div className="relative overflow-hidden rounded-3xl dark:bg-gray-900">
            <ConfettiBurst />
            <div className="relative grid gap-6 p-8 md:grid-cols-[1.2fr_0.8fr] md:p-10">
              <div>
                {/* Order Success Header */}
                <div className="mb-4 flex items-center gap-3">
                  <motion.div
                    initial={{ scale: 0.6, rotate: -10, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 280, damping: 18 }}
                    className="rounded-full bg-emerald-100 p-2.5"
                  >
                    <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                  </motion.div>
                  <div>
                    <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Order placed successfully
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Order ID:{' '}
                      <span className="font-mono">{orderInfo.orderID}</span>
                    </p>
                  </div>
                </div>

                {/* Badges */}
                <div className="mb-6 flex flex-wrap md:flex-nowrap w-full items-center gap-2">
                  <Badge tone={orderInfo.status=="CANCELLED"?"red":orderInfo.status=="PENDING" || orderInfo.status=="PROCESSING"?"amber":orderInfo.status=="DELIVERED"?"green":"gray"}>Status: {orderInfo.status}</Badge>
                  <Badge
                    tone={
                      orderInfo.Payments.status == 'CANCELLED' ||
                      orderInfo.Payments.status == 'FAILED'
                        ? 'red'
                        : orderInfo.Payments.status == 'PENDING'
                        ? 'amber'
                        : 'green'
                    }
                  >
                    <CreditCard className="mr-1 h-3.5 w-3.5" /> Payment:{' '}
                    {orderInfo.Payments.status}
                  </Badge>
                  <Badge tone="gray">
                    Method: {orderInfo.Payments.paymentMethod}
                  </Badge>
                </div>

                {/* Estimated Delivery */}
                <div className="rounded-2xl p-4 bg-gray-50 dark:bg-gray-800">
                  <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                    <Truck className="h-4 w-4" />
                    Estimated delivery:{' '}
                    <span className="font-medium text-gray-900 dark:text-white">
                      Expect delivery by {getEstimatedDelivery(3)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button
                    variant="default"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Truck className="h-4 w-4" /> Track order
                  </Button>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <ReceiptText className="h-4 w-4" /> View invoice
                  </Button>
                  <Link href="/products">
                    <Button
                      variant="secondary"
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <ArrowRight className="h-4 w-4" /> Continue shopping
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center py-20 text-gray-600">
          You are not authorized to view this order
          <Link className="text-blue-400" href="/products">
            {' '}
            Go to shop
          </Link>
        </p>
      )}
    </>
  );
}