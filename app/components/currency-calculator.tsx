"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export interface CurrencyCost {
  id: string;
  name: string;
  perStep: Record<string, number>;
  oneTime?: {
    stepId: string;
    amount: number;
  };
}

interface CurrencyCalculatorProps {
  totalWeapons: number;
  stepCounts: Record<string, number>;
  currencies: CurrencyCost[];
  storageKey: string;
}

export function CurrencyCalculator({
  totalWeapons,
  stepCounts,
  currencies,
  storageKey,
}: CurrencyCalculatorProps) {
  const [balances, setBalances] = useState<Record<string, number>>({});
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const savedBalances = localStorage.getItem(storageKey);
    setBalances(savedBalances ? JSON.parse(savedBalances) : {});
    setIsMounted(true);
  }, [storageKey]);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem(storageKey, JSON.stringify(balances));
    }
  }, [balances, isMounted, storageKey]);

  const currencyTotals = useMemo(() => currencies.map(currency => {
    const perWeaponRequired = Object.entries(currency.perStep).reduce(
      (total, [stepId, amount]) =>
        total + amount * Math.max(0, totalWeapons - (stepCounts[stepId] || 0)),
      0
    );
    const oneTimeRequired = currency.oneTime &&
      (stepCounts[currency.oneTime.stepId] || 0) === 0
      ? currency.oneTime.amount
      : 0;
    const required = perWeaponRequired + oneTimeRequired;
    const balance = balances[currency.id] || 0;

    return {
      ...currency,
      required,
      balance,
      shortfall: Math.max(0, required - balance),
    };
  }), [balances, currencies, stepCounts, totalWeapons]);

  const handleBalanceChange = (currencyId: string, value: number) => {
    setBalances(previous => ({
      ...previous,
      [currencyId]: Math.max(0, value),
    }));
  };

  return (
    <Card className="h-fit self-start">
      <CardHeader>
        <CardTitle>Currency calculator</CardTitle>
        <CardDescription>
          Estimates fixed vendor currency for unchecked weapon stages. Enter your balances to see what you still need.
          It uses the listed vendor route (Poetics when available); farmed, crafted, alternate-vendor, and Market Board routes are not modeled.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {currencyTotals.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-2 pr-4 font-medium">Currency</th>
                  <th className="py-2 px-2 text-right font-medium">Needed</th>
                  <th className="py-2 px-2 text-right font-medium">You have</th>
                  <th className="py-2 pl-2 text-right font-medium">Shortfall</th>
                </tr>
              </thead>
              <tbody>
                {currencyTotals.map(currency => (
                  <tr key={currency.id} className="border-b last:border-0">
                    <td className="py-2 pr-4 font-medium">{currency.name}</td>
                    <td className="py-2 px-2 text-right tabular-nums">
                      {currency.required.toLocaleString()}
                    </td>
                    <td className="py-2 px-2">
                      <Input
                        aria-label={`${currency.name} balance`}
                        className="ml-auto w-28 text-right"
                        type="number"
                        min="0"
                        value={isMounted ? currency.balance : ""}
                        onChange={event =>
                          handleBalanceChange(currency.id, Number(event.target.value) || 0)
                        }
                      />
                    </td>
                    <td className="py-2 pl-2 text-right tabular-nums">
                      {currency.shortfall.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No fixed vendor currency costs are included for this relic series; its tracked requirements are farmed items.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
