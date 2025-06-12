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

interface armor {
  id: string;
  name: string;
}

interface armorStep {
  id: string;
  name: string;
}

interface CheckboxTableProps {
  armors: armor[];
  steps: armorStep[];
  storageKey: string;
  onToggleChange?: (data: Record<string, Record<string, boolean>>) => void;
}

export const ArmorsTable: React.FC<CheckboxTableProps> = ({ 
  armors, 
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
        armors.forEach(armor => {
          initialState[step.id][armor.id] = false;
        });
      });
      setCheckedState(initialState);
    }
  }, [storageKey, steps, armors]);

  // Save to localStorage when state changes
  useEffect(() => {
    if (isMounted && checkedState) {
      localStorage.setItem(storageKey, JSON.stringify(checkedState));
      onToggleChange?.(checkedState);
    }
  }, [checkedState, storageKey, onToggleChange, isMounted]);

  const handleCheckboxChange = (stepId: string, armorId: string) => {
    setCheckedState(prev => {
      if (!prev) return prev;

      return {
        ...prev,
        [stepId]: {
          ...prev[stepId],
          [armorId]: !prev[stepId][armorId]
        }
      };
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
            {armors.map((armor) => {
              return (
                <TableHead key={armor.id}>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-sm">{armor.name}</span>
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
              {armors.map((armor) => {
                const isChecked = checkedState[step.id][armor.id];
                return (
                  <TableCell key={`${step.id}-${armor.id}`} style={{ padding: "2px" }}>
                    <div className="flex items-center justify-center">
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={() => handleCheckboxChange(step.id, armor.id)}
                        className="h-5 w-5 pr-0"
                        aria-label={`Toggle ${armor.name} for ${step.name}`
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