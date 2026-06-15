'use client';
import { Button } from '@/components/ui/button';
import { appConfig } from '@/constant/app.config';
import { useCartStore } from '@/hook/persist';
import { productItems } from '@/types/product';
import { formatPrice } from '@/utils';
import { Minus, Plus, ShoppingBasket } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { toast } from 'sonner';

export default function ProductCard({
  productInfo,
}: {
  productInfo: productItems;
}) {
  const { id, name, description, price, stock, discount, imageUrl, slug, attributes } =
    productInfo;

  const addtocartAction = useCartStore();

  const isAlreadyinCart = addtocartAction.cart.find((item) => item.id == id);

  const addTocartkeys = {
    ...productInfo,
    attributes: null,
  };

  const defultSize = attributes.find((item) => item.key == 'size')?.value || undefined;
  const defaultColor = attributes.find((item) => item.key == 'color')?.value || undefined;

  const handleAddtoCart = () => {
    addtocartAction.addToCart({
      ...addTocartkeys,
      quantity: 1,
      size: defultSize,
      color: defaultColor,
    });
    toast.success('Your selection is now in the cart 🎉');
  };

  const handleIncrement = () => {
    if (isAlreadyinCart && stock === isAlreadyinCart.quantity) {
      toast.warning(`Only ${stock} in stock — you've reached the limit`);
      return;
    }
    addtocartAction.increment(id);
  };

  const handleDecrement = () => addtocartAction.decrement(id);

  const finalPrice = discount > 0 ? price - (price * discount) / 100 : price;

  return (
    <div
      key={id}
      className="group relative bg-white rounded-3xl overflow-hidden shadow-2xl shadow-gray-100 hover:shadow-2xl transition-shadow duration-300 border border-gray-200/60 flex flex-col h-full"
    >
      {/* Image takes top ~65% as a full-bleed banner */}
      <Link
        href={`/products/${encodeURIComponent(slug)}`}
        className="relative w-full aspect-square bg-gray-50 block overflow-hidden"
      >
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Top badges */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
          {discount > 0 ? (
            <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
              -{discount}%
            </span>
          ) : (
            <span />
          )}
          {stock < 1 && (
            <span className="bg-gray-900/80 text-white text-xs font-bold px-3 py-1 rounded-full">
              Out of stock
            </span>
          )}
        </div>

        {/* Bottom gradient + price overlay */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-3 left-3 flex items-baseline gap-2">
          <span className="text-lg font-bold text-white drop-shadow-sm">
            {formatPrice(finalPrice)}
          </span>
          {discount > 0 && (
            <span className="text-xs text-gray-200 line-through">
              {formatPrice(price)}
            </span>
          )}
        </div>
      </Link>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-1">
        <Link href={`/products/${encodeURIComponent(slug)}`}>
          <h3 className="text-base font-semibold text-gray-800 truncate hover:text-violet-600 transition-colors">
            {name}
          </h3>
        </Link>
        <p className="text-sm text-gray-500 line-clamp-2 mt-1">{description}</p>

        <div className="mt-2">
          <span
            className={`${
              stock > 10 ? 'text-gray-500' : stock > 0 ? 'text-orange-500' : 'text-red-500'
            } text-xs font-medium`}
          >
            {stock > 0 ? `${stock} left in stock` : 'Unavailable'}
          </span>
        </div>

        <div className="flex-1" />

        {/* cart action */}
        <div>
          {!isAlreadyinCart && (
            <Button
              onClick={handleAddtoCart}
              variant="secondary"
              disabled={stock < 1}
              className="mt-3 cursor-pointer hover:bg-gray-200 w-full"
            >
              <ShoppingBasket className="h-4 w-4" /> Add to cart
            </Button>
          )}

          {isAlreadyinCart && (
            <div className="mt-3 flex items-center justify-between gap-2">
              <Button
                disabled={isAlreadyinCart.quantity == appConfig.cartLimit.MIN}
                onClick={handleDecrement}
                variant="secondary"
                size="icon"
                className="cursor-pointer hover:bg-gray-200 w-[33%]"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-sm font-semibold text-center w-[20%]">
                {isAlreadyinCart.quantity}
              </span>
              <Button
                onClick={handleIncrement}
                disabled={isAlreadyinCart.quantity >= stock}
                variant="secondary"
                size="icon"
                className="cursor-pointer hover:bg-gray-200 w-[33%]"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}