"use client";

import { WeaponsTable } from "@/components/weapons-table";
import { InventoryTable } from "@/components/inventory-table";
import { useState, useCallback, useMemo, useEffect } from "react";

export default function MandervilleTracker() {

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
    { id: 'sge', name: 'SGE' },
    { id: 'mnk', name: 'MNK' },
    { id: 'drg', name: 'DRG' },
    { id: 'nin', name: 'NIN' },
    { id: 'sam', name: 'SAM' },
    { id: 'rpr', name: 'RPR' },
    { id: 'brd', name: 'BRD' },
    { id: 'mch', name: 'MCH' },
    { id: 'dnc', name: 'DNC' },
    { id: 'blm', name: 'BLM' },
    { id: 'smn', name: 'SMN' },
    { id: 'rdm', name: 'RDM' },
  ];

  const steps = [
    { id: 'step1', name: 'Manderville' },
    { id: 'step2', name: 'Amazing' },
    { id: 'step3', name: 'Majestic' },
    { id: 'step4', name: 'Mandervillous' },
  ];

  const JOBS_COUNT = weapons.length;

  // Initialize state from localStorage after mount
  useEffect(() => {
    setIsLoading(true);
    
    const savedInventory = localStorage.getItem("mandervilleInventory");
    const savedWeaponProgress = localStorage.getItem("mandervilleWeaponProgress");

    setInventory(savedInventory ? JSON.parse(savedInventory) : {
        meteorite: 0,
        chondrite: 0,
        achondrite: 0,
        crystallite: 0,
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
    localStorage.setItem("mandervilleWeaponProgress", JSON.stringify(data));
  }, []);

  // Calculate materials needed using useMemo to prevent unnecessary recalculations
  const materials = useMemo(() => [
    { id: 'meteorite', name: 'Manderium Meteorite', category: 'Manderville', needed: 3 },
    { id: 'chondrite', name: 'Complementary Chondrite', category: 'Amazing', needed: 3 },
    { id: 'achondrite', name: 'Amplifying Achondrite', category: 'Majestic', needed: 3 },
    { id: 'crystallite', name: 'Cosmic Crystallite', category: 'Mandervillous', needed: 3 },
  ], []);

  const calculateNeeded = useCallback((material: {id: string, needed: number}): number => {
    switch(material.id) {
      case 'meteorite': return material.needed *JOBS_COUNT
      case 'chondrite': return material.needed * JOBS_COUNT
      case 'achondrite': return material.needed * JOBS_COUNT
      case 'crystallite': return material.needed * JOBS_COUNT
      default: return 0;
    }
  }, [weaponCounts]);

  const calculateTotalMaterials = useCallback((material: {id: string, needed: number}, held: number): number => {
    switch(material.id) {
        case 'meteorite': return material.needed * weaponCounts['step1'] + held;
        case 'chondrite': return material.needed * weaponCounts['step2'] + held;
        case 'achondrite': return material.needed * weaponCounts['step3'] + held;
        case 'crystallite': return material.needed * weaponCounts['step4'] + held;
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
      localStorage.setItem("mandervilleInventory", JSON.stringify(newInventory));
      return newInventory;
    });
  }, []);


  return (
    <div className="p-16 space-y-6">
      <h1 className="text-2xl font-bold">Manderville Weapons Progress</h1>
      
      <div className="flex flex-col gap-8">
      <WeaponsTable 
        weapons={weapons} 
        steps={steps} 
        storageKey="mandervilleWeaponProgress"
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