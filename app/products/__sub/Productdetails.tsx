'use client';

import { Lens } from '@/components/magicui/lens';
import { Button } from '@/components/ui/button';
import { appConfig } from '@/constant/app.config';
import { useCartStore } from '@/hook/persist';
import { productItems } from '@/types/product';
import QRCode from 'react-qr-code';
import {
  Heart,
  Minus,
  Palette,
  Plus,
  Ruler,
  ShoppingBasket,
  Sparkles,
  Truck,
} from 'lucide-react';
import Image from 'next/image';
import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import useWishStore from '@/hook/useWishStore';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPrice } from '@/utils';

export default function Productdetails({ product }: { product: productItems }) {
  const {
    id,
    name,
    description,
    price,
    stock,
    discount,
    imageUrl,
    category,
    attributes,
    slug,
  } = product;


  const wishStore = useWishStore();
  const cartStore = useCartStore();
  const isAlreadyInCart = cartStore.cart.find((item) => item.id === id);
  const isAlreadyInWish = wishStore.wishlist.find((item) => item.id == id);

  const { COLOR_LEN_MAX, DESCRIPTION_LEN_MAX, SIZE_LEN_MAX } =
    appConfig.singleProductLimit;

  const discountedPrice = useMemo(
    () => price - (price * discount) / 100,
    [price, discount]
  );

  const isAvailable = stock > 0;
  const hasColors = attributes?.some((a) => a.key === 'color');
  const hasSizes = attributes?.some((a) => a.key === 'size');

  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [qty, setQty] = useState<number>(1);
  const [imgLoaded, setImgLoaded] = useState(false);

  // Initialize variant selection: prefer what's already in cart, otherwise default to first option.
  useEffect(() => {
    const firstColor = attributes?.find((attr) => attr.key === 'color')?.value;
    const firstSize = attributes?.find((attr) => attr.key === 'size')?.value;

    setSelectedColor(isAlreadyInCart?.color || firstColor || '');
    setSelectedSize(isAlreadyInCart?.size || firstSize || '');
  }, [attributes, isAlreadyInCart]);

  const variantMissing =
    (hasColors && !selectedColor) || (hasSizes && !selectedSize);

  const handleAddToCart = () => {
    if (variantMissing) {
      toast.warning('Please select all required options (color/size).');
      return;
    }
    cartStore.addToCart({
      ...product,
      quantity: qty,
      color: selectedColor || undefined,
      size: selectedSize || undefined,
    });
    toast.success('Added to cart 🎉');
  };

  const handleIncrementCart = () => {
    if (isAlreadyInCart && isAlreadyInCart.quantity >= stock) {
      toast.warning(`Only ${stock} in stock — limit reached`);
      return;
    }
    cartStore.increment(id);
  };

  const handleDecrementCart = () => cartStore.decrement(id);

  const handleQtyDecrement = () => setQty((q) => Math.max(1, q - 1));
  const handleQtyIncrement = () =>
    setQty((q) => (q >= stock ? q : q + 1));

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* Left: Media */}
        <div className="flex justify-center md:justify-start">
          <div className="rounded-2xl overflow-hidden p-4 bg-white border border-gray-100 w-full md:w-auto">
            <div className="relative h-[320px] sm:h-[400px] md:h-[480px] md:w-[480px] mx-auto">
              {!imgLoaded && (
                <Skeleton className="absolute inset-0 rounded-xl" />
              )}
              <Lens lensSize={200} zoomFactor={2} duration={0.2}>
                <Image
                  src={imageUrl }
                  alt={name}
                  fill
                  className={`rounded-xl object-contain transition-opacity duration-300 ${
                    imgLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  priority
                  onLoad={() => setImgLoaded(true)}
                  onError={() => setImgLoaded(true)}
                />
              </Lens>
            </div>
          </div>
        </div>

        {/* Right: Details */}
        <div className="flex flex-col gap-5">
          {/* Meta */}
          <div className="flex items-center justify-between gap-3">
            <div className="text-xs text-gray-500">
              <span className="capitalize">{category?.name}</span>
              <span className="mx-2">•</span>
              <span>SKU: {id.slice(0, 8).toUpperCase()}</span>
            </div>

            {/* QR */}
            <div className="hidden lg:flex flex-col items-center gap-1">
              <div className="p-1.5 bg-white border border-gray-100 rounded-md">
                <QRCode
                  size={56}
                  value={`${appConfig.hostname.BASE_URL}/products/${slug}`}
                  viewBox="0 0 256 256"
                />
              </div>
              <span className="text-[11px] text-gray-400">Scan to view</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            {name}
          </h1>

          {/* Highlight badge */}
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full w-fit">
            <Sparkles className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            Trending pick this week
          </span>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed">
            {description
              ? description.slice(0, DESCRIPTION_LEN_MAX) +
                (description.length > DESCRIPTION_LEN_MAX ? '…' : '')
              : 'No description available.'}
          </p>

          {/* Price */}
          <div className="flex items-end gap-3">
            {discount > 0 ? (
              <>
                <span className="text-3xl font-extrabold text-gray-800">
                  {formatPrice(discountedPrice)}
                </span>
                <span className="text-lg line-through text-gray-400">
                  {formatPrice(price)}
                </span>
                <span className="px-2 py-0.5 bg-red-500 text-white font-medium text-sm rounded-md">
                  -{discount}%
                </span>
              </>
            ) : (
              <span className="text-3xl font-bold text-gray-800">
                {formatPrice(price)}
              </span>
            )}
          </div>

          {/* Stock */}
          <div className="flex items-center gap-3 flex-wrap">
            <span
              className={`text-xs font-medium px-2.5 py-1 rounded-md ${
                isAvailable
                  ? 'bg-green-500/10 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {isAvailable ? `In Stock (${stock})` : 'Out of Stock'}
            </span>
            {isAvailable && stock <= 3 && (
              <span className="text-xs text-amber-600">
                Hurry—only {stock} left!
              </span>
            )}
            <span className="text-xs text-gray-500">
              Free returns within 7 days
            </span>
          </div>

          {/* Attributes */}
          {attributes && attributes.length > 0 && (
            <div className="mt-3 space-y-6 leading-relaxed">
              {/* Color */}
              {hasColors && (
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Palette className="w-4 h-4 text-gray-500" />
                    <span className="font-semibold">Color</span>
                    {selectedColor ? (
                      <span className="inline-flex items-center gap-2 ml-2 text-xs rounded-full bg-gray-100 px-2 py-0.5">
                        <span
                          aria-hidden
                          className="inline-block w-3.5 h-3.5 rounded-full border border-gray-300"
                          style={{ backgroundColor: selectedColor }}
                        />
                        <span className="font-medium capitalize">
                          {selectedColor}
                        </span>
                      </span>
                    ) : (
                      <span className="ml-2 text-xs text-gray-400">
                        Choose a color
                      </span>
                    )}
                  </div>

                  <ul className="mt-2 flex flex-wrap items-center gap-2">
                    {attributes
                      .filter((attr) => attr.key === 'color')
                      .slice(0, COLOR_LEN_MAX)
                      .map((attr, idx) => (
                        <li
                          key={`${attr.value}-${idx}`}
                          tabIndex={0}
                          role="button"
                          aria-disabled={!!isAlreadyInCart?.color}
                          aria-label={`Select color ${attr.value}`}
                          onClick={() => {
                            if (!isAlreadyInCart?.color) {
                              setSelectedColor(attr.value);
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              if (!isAlreadyInCart?.color) {
                                setSelectedColor(attr.value);
                              }
                            }
                          }}
                          className={`w-7 h-7 rounded-full transition outline-none
                            ${
                              isAlreadyInCart?.color
                                ? 'cursor-not-allowed opacity-70'
                                : 'cursor-pointer'
                            }
                            ${
                              selectedColor === attr.value
                                ? 'ring-2 ring-offset-1 ring-gray-400'
                                : ''
                            }`}
                          style={{ backgroundColor: attr.value }}
                          title={attr.value}
                        />
                      ))}
                  </ul>
                </div>
              )}

              {/* Size */}
              {hasSizes && (
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Ruler className="w-4 h-4 text-gray-500" />
                    <span className="font-semibold">Size</span>
                    {selectedSize ? (
                      <span className="ml-2 inline-flex items-center text-xs font-medium rounded-full bg-gray-900 text-white px-2 py-0.5 uppercase">
                        {selectedSize}
                      </span>
                    ) : (
                      <span className="ml-2 text-xs text-gray-400">
                        Choose a size
                      </span>
                    )}
                  </div>

                  <ul className="mt-2 flex flex-wrap items-center gap-2">
                    {attributes
                      .filter((attr) => attr.key === 'size')
                      .slice(0, SIZE_LEN_MAX)
                      .map((attr, idx) => (
                        <li
                          key={`${attr.value}-${idx}`}
                          tabIndex={0}
                          role="button"
                          aria-label={`Select size ${attr.value}`}
                          onClick={() => {
                            if (!isAlreadyInCart?.size) {
                              setSelectedSize(attr.value);
                            }
                          }}
                          aria-disabled={!!isAlreadyInCart?.size}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              if (!isAlreadyInCart?.size) {
                                setSelectedSize(attr.value);
                              }
                            }
                          }}
                          className={`px-3 py-1.5 rounded-md border-2 text-xs md:text-sm font-semibold uppercase transition outline-none
                            ${
                              isAlreadyInCart?.size
                                ? 'cursor-not-allowed opacity-70'
                                : 'cursor-pointer hover:border-gray-400'
                            }
                            ${
                              selectedSize === attr.value
                                ? 'bg-gray-900 text-white border-gray-900'
                                : 'border-gray-300 text-gray-700'
                            }`}
                        >
                          {attr.value}
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="mt-2 space-y-3">
            {isAlreadyInCart ? (
              <div>
                <div className="flex items-center gap-2">
                  <Button
                    disabled={
                      isAlreadyInCart.quantity === appConfig.cartLimit.MIN
                    }
                    onClick={handleDecrementCart}
                    variant="secondary"
                    className="hover:bg-gray-200 cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="text-lg font-semibold w-10 text-center">
                    {isAlreadyInCart.quantity}
                  </span>
                  <Button
                    onClick={handleIncrementCart}
                    disabled={isAlreadyInCart.quantity >= stock}
                    variant="secondary"
                    className="hover:bg-gray-200 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="mt-5">
                  <Button asChild variant="default" className="cursor-pointer w-full sm:w-auto">
                    <Link href="/checkout">Checkout</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-3">
                {/* Quantity stepper */}
                <div className="flex items-center border border-gray-200 rounded-md">
                  <button
                    type="button"
                    onClick={handleQtyDecrement}
                    disabled={qty <= 1}
                    className="p-2 cursor-pointer text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition rounded-l-md"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center text-sm font-semibold">{qty}</span>
                  <button
                    type="button"
                    onClick={handleQtyIncrement}
                    disabled={qty >= stock}
                    className="p-2 cursor-pointer text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition rounded-r-md"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <Button
                  onClick={handleAddToCart}
                  variant="default"
                  disabled={!isAvailable || variantMissing}
                  className="flex items-center gap-2 cursor-pointer flex-1 sm:flex-none"
                >
                  <ShoppingBasket className="w-5 h-5" />
                  {variantMissing ? 'Select options' : 'Add to Cart'}
                </Button>

                <Button
                  onClick={() => wishStore.toggle(product)}
                  variant="outline"
                  size="icon"
                  className="cursor-pointer shrink-0"
                  title={
                    isAlreadyInWish
                      ? 'Remove from wishlist'
                      : 'Save to wishlist'
                  }
                >
                  <Heart
                    className={`${
                      isAlreadyInWish ? 'fill-red-500 stroke-red-500' : ''
                    } stroke-1`}
                    size={22}
                  />
                </Button>
              </div>
            )}
          </div>

          <div className="mt-2 text-xs text-gray-600 flex items-center gap-1">
            <Truck size={16} /> Delivery in 2–5 days • Cash on Delivery
            available
          </div>
        </div>
      </div>
    </div>
  );
}