"use client";

import { WeaponsTable } from "@/components/weapons-table";
import { InventoryTable } from "@/components/inventory-table";
import { useState, useCallback, useMemo, useEffect } from "react";

export default function ResistanceTracker() {

  const [isLoading, setIsLoading] = useState(true);
  const [inventory, setInventory] = useState<Record<string, number>>({});
  const [weaponCounts, setWeaponCounts] = useState<Record<string, number>>({});

  const weapons = [
    { id: 'pld', name: 'PLD' },
    { id: 'war', name: 'WAR' },
    { id: 'drk', name: 'DRK' },
    { id: 'gnb', name: 'GNB' },
    { id: 'whm', name: 'WHM' },
    { id: 'sch', name: 'SCH' },
    { id: 'ast', name: 'AST' },
    { id: 'mnk', name: 'MNK' },
    { id: 'drg', name: 'DRG' },
    { id: 'nin', name: 'NIN' },
    { id: 'sam', name: 'SAM' },
    { id: 'brd', name: 'BRD' },
    { id: 'mch', name: 'MCH' },
    { id: 'dnc', name: 'DNC' },
    { id: 'blm', name: 'BLM' },
    { id: 'smn', name: 'SMN' },
    { id: 'rdm', name: 'RDM' },
  ];

  const steps = [
    { id: 'step1', name: 'Resistance' },
    { id: 'step2', name: 'Augmented' },
    { id: 'step3', name: 'Recollection' },
    { id: 'step4', name: 'Law\s Order' },
    { id: 'step5', name: 'Augmented Law\'s' },
    { id: 'step6', name: 'Blades' },
  ];

  const JOBS_COUNT = weapons.length;

  // Initialize state from localStorage after mount
  useEffect(() => {
    setIsLoading(true);
    
    const savedInventory = localStorage.getItem("resistanceInventory");
    const savedWeaponProgress = localStorage.getItem("resistanceWeaponProgress");

    setInventory(savedInventory ? JSON.parse(savedInventory) : {
        thavScale: 0,
        tortMem: 0,
        sorrMem: 0,
        harrMem: 0,
        bittMem: 0,
        loathMem: 0,
        timeArt: 0,
        rawEmo: 0,  
    });

    if (savedWeaponProgress) {
      const data = JSON.parse(savedWeaponProgress);
      const counts: Record<string, number> = {};
      Object.entries(data).forEach(([stepId, weapons]) => {
        counts[stepId] = Object.values(weapons as Record<string, boolean>).filter(owned => owned).length;
      });
      setWeaponCounts(counts);
    }

    setIsLoading(false);
  }, []);

  // Stable callback that won't change between renders
  const handleToggleChange = useCallback((data: Record<string, Record<string, boolean>>) => {

    // Calculate counts for each step
    const counts: Record<string, number> = {};
    
    Object.entries(data).forEach(([stepId, weapons]) => {
      counts[stepId] = Object.values(weapons).filter(owned => owned).length;
    });

    setWeaponCounts(prev => {
      if (JSON.stringify(prev) === JSON.stringify(counts)) return prev;
      return counts;
    });
    localStorage.setItem("resistanceWeaponProgress", JSON.stringify(data));
  }, []);

  // Calculate materials needed using useMemo to prevent unnecessary recalculations
  const materials = useMemo(() => [
    { id: 'thavScale', name: 'Thavnairian Scalepowder', category: 'Resistance', needed: 4 },
    { id: 'tortMem', name: 'Tortured Memories', category: 'Augmented', needed: 20 },
    { id: 'sorrMem', name: 'Sorrowful Memories', category: 'Augmented', needed: 20 },
    { id: 'harrMem', name: 'Harrowing Memories', category: 'Augmented', needed: 20 },
    { id: 'bittMem', name: 'Bitter Memories', category: 'Recollection', needed: 6 },
    { id: 'loathMem', name: 'Loathsome Memories', category: 'Law\s Order', needed: 15 },
    { id: 'timeArt', name: 'Timeworn Artifacts', category: 'Augmented Law\'s', needed: 15 },
    { id: 'rawEmo', name: 'Raw Emotions', category: 'Blades', needed: 15 },
  ], []);

  const calculateNeeded = useCallback((material: {id: string, needed: number}): number => {
    switch(material.id) {
      case 'thavScale': return material.needed *JOBS_COUNT
      case 'tortMem': return material.needed * JOBS_COUNT
      case 'sorrMem': return material.needed * JOBS_COUNT
      case 'harrMem': return material.needed * JOBS_COUNT
      case 'bittMem': return material.needed * JOBS_COUNT
      case 'loathMem': return material.needed * JOBS_COUNT
      case 'timeArt': return material.needed * JOBS_COUNT
      case 'rawEmo': return material.needed * JOBS_COUNT
      default: return 0;
    }
  }, [weaponCounts]);

  const calculateTotalMaterials = useCallback((material: {id: string, needed: number}, held: number): number => {
    switch(material.id) {
        case 'thavScale': return material.needed * weaponCounts['step1'] + held;
        case 'tortMem': return material.needed * weaponCounts['step2'] + held;
        case 'sorrMem': return material.needed * weaponCounts['step2'] + held;
        case 'harrMem': return material.needed * weaponCounts['step2'] + held;
        case 'bittMem': return material.needed * weaponCounts['step3'] + held;
        case 'loathMem': return material.needed * weaponCounts['step4'] + held;
        case 'timeArt': return material.needed * weaponCounts['step5'] + held;
        
        default: return held;
    }

  }, [weaponCounts]);

  const materialData = useMemo(() => {
    return materials.map(material => {
        const totalNeeded = calculateNeeded(material);
        const held = inventory[material.id] || 0;
        const totalHeldMaterials = calculateTotalMaterials(material, held);
        const remaining = Math.max(0, totalNeeded - totalHeldMaterials);
        const progress = totalNeeded > 0 ? Math.min(100, (totalHeldMaterials / totalNeeded) * 100) : 100;

        return {
            ...material,
            totalNeeded,
            held,
            totalHeldMaterials,
            remaining,
            progress
        };
    });
  }, [inventory, materials, calculateNeeded]);

  const handleInventoryChange = useCallback((materialId: string, value: number) => {
    setInventory(prev => {
      const newValue = Math.max(0, value);
      if (prev[materialId] === newValue) return prev;
      
      const newInventory = { ...prev, [materialId]: newValue };
      localStorage.setItem("resistanceInventory", JSON.stringify(newInventory));
      return newInventory;
    });
  }, []);


  return (
    <div className="p-16 space-y-6">
      <h1 className="text-2xl font-bold">Resistance Weapons Progress</h1>
      
      <div className="flex flex-col gap-8">
      <WeaponsTable 
        weapons={weapons} 
        steps={steps} 
        storageKey="resistanceWeaponProgress"
        onToggleChange={handleToggleChange} 
      />

      <InventoryTable 
        materials={materialData} 
        onInventoryChange={handleInventoryChange} 
        isLoading={isLoading}
      />
      </div>
      
    </div>
  );
}