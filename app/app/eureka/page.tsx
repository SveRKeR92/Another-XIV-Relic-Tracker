"use client";

import { WeaponsTable } from "@/components/weapons-table";
import { InventoryTable } from "@/components/inventory-table";
import { useState, useCallback, useMemo, useEffect } from "react";

export default function EurekaTracker() {

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
    { id: 'sam', name: 'SAM' },
    { id: 'brd', name: 'BRD' },
    { id: 'mch', name: 'MCH' },
    { id: 'blm', name: 'BLM' },
    { id: 'smn', name: 'SMN' },
    { id: 'rdm', name: 'RDM' },
  ];

  const steps = [
    { id: 'step1', name: 'Anemos' },
    { id: 'step2', name: 'Pagos' },
    { id: 'step3', name: 'Pyros' },
    { id: 'step4', name: 'Hydatos' },
    { id: 'step5', name: 'Physeos' },
  ];

  const JOBS_COUNT = weapons.length;

  // Initialize state from localStorage after mount
  useEffect(() => {
    setIsLoading(true);
    
    const savedInventory = localStorage.getItem("eurekaInventory");
    const savedWeaponProgress = localStorage.getItem("eurekaWeaponProgress");

    setInventory(savedInventory ? JSON.parse(savedInventory) : {
        protCrystal: 0,
        pazFeather: 0,
        frostCrystal: 0,
        pagosCrystal: 0,
        louhiIce: 0,
        pyrosCrystal: 0,
        pennyFlame: 0,
        hydatCrystal: 0,
        crystalScale: 0,
        eurekaFragment: 0,   
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
    localStorage.setItem("eurekaWeaponProgress", JSON.stringify(data));
  }, []);

  // Calculate materials needed using useMemo to prevent unnecessary recalculations
  const materials = useMemo(() => [
    { id: 'protCrystal', name: 'Protean Crystals', category: 'Anemos', needed: 1300 },
    { id: 'pazFeather', name: 'Pazuzu\'s Feather', category: 'Anemos', needed: 3 },
    { id: 'frostCrystal', name: 'Frosted Crystals', category: 'Pagos', needed: 31 },
    { id: 'pagosCrystal', name: 'Pagos Crystals', category: 'Pagos', needed: 500 },
    { id: 'louhiIce', name: 'Louhi\'s Ice', category: 'Pagos', needed: 5 },
    { id: 'pyrosCrystal', name: 'Pyros Crystals', category: 'Pyros', needed: 650 },
    { id: 'pennyFlame', name: 'Penthesilea\'s Flame', category: 'Pyros', needed: 5 },
    { id: 'hydatCrystal', name: 'Hydatos Crystals', category: 'Hydatos', needed: 350 },
    { id: 'crystalScale', name: 'Crystalline Scale', category: 'Hydatos', needed: 5 },
    { id: 'eurekaFragment', name: 'Eureka Fragments', category: 'Physeos', needed: 100 },
  ], []);

  const calculateNeeded = useCallback((material: {id: string, needed: number}): number => {
    switch(material.id) {
      case 'protCrystal': return material.needed *JOBS_COUNT
      case 'pazFeather': return material.needed * JOBS_COUNT
      case 'frostCrystal': return material.needed * JOBS_COUNT
      case 'pagosCrystal': return material.needed * JOBS_COUNT
      case 'louhiIce': return material.needed * JOBS_COUNT
      case 'pyrosCrystal': return material.needed * JOBS_COUNT
      case 'pennyFlame': return material.needed * JOBS_COUNT
      case 'hydatCrystal': return material.needed * JOBS_COUNT
      case 'crystalScale': return material.needed * JOBS_COUNT
      case 'eurekaFragment': return material.needed * JOBS_COUNT
      default: return 0;
    }
  }, [weaponCounts]);

  const calculateTotalMaterials = useCallback((material: {id: string, needed: number}, held: number): number => {
    switch(material.id) {
        case 'protCrystal': return material.needed * weaponCounts['step1'] + held;
        case 'pazFeather': return material.needed * weaponCounts['step1'] + held;
        case 'frostCrystal': return material.needed * weaponCounts['step2'] + held;
        case 'pagosCrystal': return material.needed * weaponCounts['step2'] + held;
        case 'louhiIce': return material.needed * weaponCounts['step2'] + held;
        case 'pyrosCrystal': return material.needed * weaponCounts['step3'] + held;
        case 'pennyFlame': return material.needed * weaponCounts['step3'] + held;
        case 'hydatCrystal': return material.needed * weaponCounts['step4'] + held;
        case 'crystalScale': return material.needed * weaponCounts['step4'] + held;
        case 'eurekaFragment': return material.needed * weaponCounts['step5'] + held;
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
      <h1 className="text-2xl font-bold">Eureka Weapons Progress</h1>
      
      <div className="flex flex-col gap-8">
      <WeaponsTable 
        weapons={weapons} 
        steps={steps} 
        storageKey="eurekaWeaponProgress"
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