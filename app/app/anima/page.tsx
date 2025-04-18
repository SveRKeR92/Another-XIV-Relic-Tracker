"use client";

import { WeaponsTable } from "@/components/weapons-table";
import { InventoryTable } from "@/components/inventory-table";
import { useState, useCallback, useMemo, useEffect } from "react";

export default function AnimaTracker() {

  const [isLoading, setIsLoading] = useState(true);
  const [inventory, setInventory] = useState<Record<string, number>>({});
  const [weaponCounts, setWeaponCounts] = useState<Record<string, number>>({});

  const weapons = [
    { id: 'pld', name: 'PLD' },
    { id: 'war', name: 'WAR' },
    { id: 'drk', name: 'DRK' },
    { id: 'whm', name: 'WHM' },
    { id: 'sch', name: 'SCH' },
    { id: 'ast', name: 'AST' },
    { id: 'mnk', name: 'MNK' },
    { id: 'drg', name: 'DRG' },
    { id: 'nin', name: 'NIN' },
    { id: 'brd', name: 'BRD' },
    { id: 'mch', name: 'MCH' },
    { id: 'blm', name: 'BLM' },
    { id: 'smn', name: 'SMN' },
  ];

  const steps = [
    { id: 'step1', name: 'Animated' },
    { id: 'step2', name: 'Awoken' },
    { id: 'step3', name: 'Anima' },
    { id: 'step4', name: 'Hyperconductive' },
    { id: 'step5', name: 'Reconditioned' },
    { id: 'step6', name: 'Sharpened' },
    { id: 'step7', name: 'Complete' },
    { id: 'step8', name: 'Lux' },
  ];

  const JOBS_COUNT = weapons.length;

  // Initialize state from localStorage after mount
  useEffect(() => {
    setIsLoading(true);
    
    const savedInventory = localStorage.getItem("animaInventory");
    const savedWeaponProgress = localStorage.getItem("animaWeaponProgress");

    setInventory(savedInventory ? JSON.parse(savedInventory) : {
      animCrystals: 0,
      animBone: 0,
      animFran: 0,
      animShell: 0,
      animAlloy: 0,
      animOre: 0,
      animArrow: 0,
      animSeeds: 0,
      animCake: 0,
      hyperOil: 0,
      reconUmbr: 0,
      reconSand: 0,
      sharpCluster: 0,
      complPneu: 0,
      luxInk: 0,
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
    localStorage.setItem("animaWeaponProgress", JSON.stringify(data));
  }, []);

  // Calculate materials needed using useMemo to prevent unnecessary recalculations
  const materials = useMemo(() => [
    { id: 'animCrystals', name: 'ElementalCrystals', category: 'Animated', needed: 6 },
    { id: 'animBone', name: 'Unidentifiable Bone', category: 'Anima', needed: 10 },
    { id: 'animFran', name: 'Adamantite Francesca', category: 'Anima', needed: 4 },
    { id: 'animShell', name: 'Unidentifiable Shell', category: 'Anima', needed: 10 },
    { id: 'animAlloy', name: 'Titanium Alloy Mirror', category: 'Anima', needed: 4 },
    { id: 'animOre', name: 'Unidentifiable Ore', category: 'Anima', needed: 10 },
    { id: 'animArrow', name: 'Dispelling Arrow', category: 'Anima', needed: 4 },
    { id: 'animSeeds', name: 'Unidentifiable Seeds', category: 'Anima', needed: 10 },
    { id: 'animCake', name: 'Kingcake', category: 'Anima', needed: 4 },
    { id: 'hyperOil', name: 'Aether Oil', category: 'Hyperconductive', needed: 5 },
    { id: 'reconUmbr', name: 'Umbrite', category: 'Reconditioned', needed: 60 },
    { id: 'reconSand', name: 'Crystal Sand', category: 'Reconditioned', needed: 60 },
    { id: 'sharpCluster', name: 'Singing Cluster', category: 'Sharpened', needed: 50 },
    { id: 'complPneu', name: 'Pneumite', category: 'Complete', needed: 15 },
    { id: 'luxInk', name: 'Archaic Enchanted Ink', category: 'Lux', needed: 1 },
  ], []);

  const calculateNeeded = useCallback((material: {id: string, needed: number}): number => {
    switch(material.id) {
      case 'animCrystals': return material.needed *JOBS_COUNT
      case 'animBone': return material.needed * JOBS_COUNT
      case 'animFran': return material.needed * JOBS_COUNT
      case 'animShell': return material.needed * JOBS_COUNT
      case 'animAlloy': return material.needed * JOBS_COUNT
      case 'animOre': return material.needed * JOBS_COUNT
      case 'animArrow': return material.needed * JOBS_COUNT
      case 'animSeeds': return material.needed * JOBS_COUNT
      case 'animCake': return material.needed * JOBS_COUNT
      case 'hyperOil': return material.needed * JOBS_COUNT
      case 'reconUmbr': return material.needed * JOBS_COUNT
      case 'reconSand': return material.needed * JOBS_COUNT
      case 'sharpCluster': return material.needed * JOBS_COUNT
      case 'complPneu': return material.needed * JOBS_COUNT
      case 'luxInk': return material.needed * JOBS_COUNT
      default: return 0;
    }
  }, [weaponCounts]);

  const calculateTotalMaterials = useCallback((material: {id: string, needed: number}, held: number): number => {
    switch(material.id) {
        case 'animCrystals': return material.needed * weaponCounts['step1'] + held;
        case 'animBone': return material.needed * weaponCounts['step3'] + held;
        case 'animFran': return material.needed * weaponCounts['step3'] + held;
        case 'animShell': return material.needed * weaponCounts['step3'] + held;
        case 'animAlloy': return material.needed * weaponCounts['step3'] + held;
        case 'animOre': return material.needed * weaponCounts['step3'] + held;
        case 'animArrow': return material.needed * weaponCounts['step3'] + held;
        case 'animSeeds': return material.needed * weaponCounts['step3'] + held;
        case 'animCake': return material.needed * weaponCounts['step3'] + held;
        case 'hyperOil': return material.needed * weaponCounts['step4'] + held;
        case 'reconUmbr': return material.needed * weaponCounts['step5'] + held;
        case 'reconSand': return material.needed * weaponCounts['step5'] + held;
        case 'sharpCluster': return material.needed * weaponCounts['step6'] + held;
        case 'complPneu': return material.needed * weaponCounts['step7'] + held;
        case 'luxInk': return material.needed * weaponCounts['step8'] + held;
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
      localStorage.setItem("animaInventory", JSON.stringify(newInventory));
      return newInventory;
    });
  }, []);


  return (
    <div className="p-16 space-y-6">
      <h1 className="text-2xl font-bold">Anima Weapons Progress</h1>
      
      <div className="flex justify-between gap-16">
      <WeaponsTable 
        weapons={weapons} 
        steps={steps} 
        storageKey="animaWeaponProgress"
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