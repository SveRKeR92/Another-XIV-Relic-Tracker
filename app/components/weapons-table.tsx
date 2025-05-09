"use client";
import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "./ui/skeleton";

interface Weapon {
  id: string;
  name: string;
}

interface WeaponStep {
  id: string;
  name: string;
}

interface CheckboxTableProps {
  weapons: Weapon[];
  steps: WeaponStep[];
  storageKey: string;
  onToggleChange?: (data: Record<string, Record<string, boolean>>) => void;
}

export const WeaponsTable: React.FC<CheckboxTableProps> = ({ 
  weapons, 
  steps,
  storageKey,
  onToggleChange
}) => {
  // Initialize state as undefined first to avoid hydration mismatch
  const [checkedState, setCheckedState] = useState<Record<string, Record<string, boolean>>>();
  const [isMounted, setIsMounted] = useState(false);

  // Initialize from localStorage after mount
  useEffect(() => {
    setIsMounted(true);
    const savedData = localStorage.getItem(storageKey);
    
    if (savedData) {
      setCheckedState(JSON.parse(savedData));
    } else {
      // Initialize empty state
      const initialState: Record<string, Record<string, boolean>> = {};
      steps.forEach(step => {
        initialState[step.id] = {};
        weapons.forEach(weapon => {
          initialState[step.id][weapon.id] = false;
        });
      });
      setCheckedState(initialState);
    }
  }, [storageKey, steps, weapons]);

  // Save to localStorage when state changes
  useEffect(() => {
    if (isMounted && checkedState) {
      localStorage.setItem(storageKey, JSON.stringify(checkedState));
      onToggleChange?.(checkedState);
    }
  }, [checkedState, storageKey, onToggleChange, isMounted]);

  const handleCheckboxChange = (stepId: string, weaponId: string) => {
    setCheckedState(prev => {
      if (!prev) return prev;

      const currentValue = prev[stepId][weaponId];
      const newState = { ...prev };
      let currentStepFound = false;

      steps.forEach(step => {
        if (step.id === stepId) {
          currentStepFound = true;
        }

        if (currentValue) {
          // Unchecking: uncheck this and all subsequent steps
          if (currentStepFound) {
            newState[step.id] = {
              ...newState[step.id],
              [weaponId]: false,
            };
          }
        } else {
          // Checking: check this and all previous steps
          if (!currentStepFound || step.id === stepId) {
            newState[step.id] = {
              ...newState[step.id],
              [weaponId]: true,
            };
          }
        }
      });

      return newState;
      });
  };
  
  // Don't render until mounted to avoid hydration mismatch
  if (!isMounted || !checkedState) {
    return <Skeleton className="h-60 w-200" />;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead >Upgrade Step</TableHead>
            {weapons.map((weapon) => {
              return (
                <TableHead key={weapon.id}>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-sm">{weapon.name}</span>
                  </div>
                </TableHead>
              );
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {steps.map((step) => (
            <TableRow key={step.id}>
              <TableCell>
                {step.name}
              </TableCell>
              {weapons.map((weapon) => {
                const isChecked = checkedState[step.id][weapon.id];
                return (
                  <TableCell key={`${step.id}-${weapon.id}`} style={{ padding: "2px" }}>
                    <div className="flex items-center justify-center">
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={() => handleCheckboxChange(step.id, weapon.id)}
                        className="h-5 w-5 pr-0"
                        aria-label={`Toggle ${weapon.name} for ${step.name}`
                      }
                      />
                    </div>
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};