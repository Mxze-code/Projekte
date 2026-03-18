"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { CartItemRow } from "./cart-item";

export function CartSummary() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="rounded border border-[#2d3a4d] bg-[#1a2332] p-12 text-center">
        <p className="text-[#94a3b8]">Ihr Warenkorb ist leer.</p>
        <Link
          href="/katalog"
          className="mt-4 inline-block border border-[#c9a227] px-6 py-2 text-sm font-medium text-[#c9a227] transition hover:bg-[#c9a227]/10"
        >
          Zum Katalog
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <div className="rounded border border-[#2d3a4d] bg-[#1a2332] px-6">
          {items.map((item) => (
            <CartItemRow
              key={item.product.id}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={removeItem}
            />
          ))}
        </div>
      </div>

      <div>
        <div className="rounded border border-[#2d3a4d] bg-[#1a2332] p-6">
          <h2 className="font-heading text-lg font-semibold text-[#f0f4f8]">
            Zusammenfassung
          </h2>
          <div className="mt-4 space-y-2 border-t border-[#2d3a4d] pt-4">
            <div className="flex justify-between text-sm text-[#94a3b8]">
              <span>Zwischensumme</span>
              <span>
                {subtotal.toLocaleString("de-DE", {
                  style: "currency",
                  currency: "EUR",
                })}
              </span>
            </div>
            <div className="flex justify-between text-sm text-[#64748b]">
              <span>Versand (wird berechnet)</span>
              <span>—</span>
            </div>
          </div>
          <div className="mt-4 flex justify-between border-t border-[#2d3a4d] pt-4 font-semibold text-[#f0f4f8]">
            <span>Gesamt</span>
            <span className="text-[#c9a227]">
              {subtotal.toLocaleString("de-DE", {
                style: "currency",
                currency: "EUR",
              })}
            </span>
          </div>
          <p className="mt-4 text-xs text-[#64748b]">
            Bestellungen werden per Telefon oder E-Mail aufgenommen. Kein
            Online-Checkout.
          </p>
        </div>
      </div>
    </div>
  );
}
