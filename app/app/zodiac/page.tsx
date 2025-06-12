"use client";

import { WeaponsTable } from "@/components/weapons-table";
import { InventoryTable } from "@/components/inventory-table";
import { useState, useCallback, useMemo, useEffect } from "react";

export default function ZodiacTracker() {

  const [isLoading, setIsLoading] = useState(true);
  const [inventory, setInventory] = useState<Record<string, number>>({});
  const [weaponCounts, setWeaponCounts] = useState<Record<string, number>>({});

  const weapons = [
    { id: 'pld', name: 'PLD' },
    { id: 'war', name: 'WAR' },
    { id: 'whm', name: 'WHM' },
    { id: 'sch', name: 'SCH' },
    { id: 'mnk', name: 'MNK' },
    { id: 'drg', name: 'DRG' },
    { id: 'nin', name: 'NIN' },
    { id: 'brd', name: 'BRD' },
    { id: 'blm', name: 'BLM' },
    { id: 'smn', name: 'SMN' },
  ];

  const steps = [
    { id: 'step1', name: 'Relic' },
    { id: 'step2', name: 'Zenith' },
    { id: 'step3', name: 'Atma' },
    { id: 'step4', name: 'Animus' },
    { id: 'step5', name: 'Novus' },
    { id: 'step6', name: 'Nexus' },
    { id: 'step7', name: 'Zodiac Braves' },
    { id: 'step8', name: 'Zodiac Zeta' },
  ];

  const JOBS_COUNT = weapons.length;

  // Initialize state from localStorage after mount
  useEffect(() => {
    setIsLoading(true);
    
    const savedInventory = localStorage.getItem("zodiacInventory");
    const savedWeaponProgress = localStorage.getItem("zodiacWeaponProgress");

    setInventory(savedInventory ? JSON.parse(savedInventory) : {
      relicQuenchingOil: 0,
      zenithThavMist: 0,
      atma: 0,
      animusBooks: 0,
      novusInk: 0,
      novusMateria: 0,
      novusAlexandrite: 0,

      zodiacBombardCore: 0,
      zodiacSacredWater: 0,

      zodiacBronzeLakeCristal: 0,
      zodiacPerfectFirewood: 0,
      zodiacFurnaceRing: 0,

      zodiacBrassKettle: 0,
      zodiacEelPie: 0,
      zodiacPerfectCloth: 0,

      zodiacAllaganResin: 0,
      zodiacPerfectMortar: 0,
      zodiacPerfectPestle: 0,

      zodiacFuriteSand: 0,
      zodiacPerfectVellum: 0,
      zodiacPerfectPounce: 0,

      zetaMahatma: 0,
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
    localStorage.setItem("zodiacWeaponProgress", JSON.stringify(data));
  }, []);

  // Calculate materials needed using useMemo to prevent unnecessary recalculations
  const materials = useMemo(() => [
    { id: 'relicQuenchingOil', name: 'Radz-at-Han Quenching Oil', category: 'Relic', needed: 1 },
    { id: 'zenithThavMist', name: 'Thavnairian Mist', category: 'Zenith', needed: 3 },
    { id: 'atma', name: 'Atmas', category: 'Atma', needed: 12 },
    { id: 'animusBooks', name: 'Books', category: 'Animus', needed: 9 },
    { id: 'novusInk', name: 'Novus Ink', category: 'Novus', needed: 3 },
    { id: 'novusMateria', name: 'Novus Materia', category: 'Novus', needed: 75 },
    { id: 'novusAlexandrite', name: 'Novus Alexandrite', category: 'Novus', needed: 75 },
    { id: 'zodiacBombardCore', name: 'Bombard Core', category: 'Zodiac', needed: 4 },
    { id: 'zodiacSacredWater', name: 'Sacred Spring Water', category: 'Zodiac', needed: 4 },
    { id: 'zodiacBronzeLakeCristal', name: 'Bronze Lake Crystal', category: 'Zodiac', needed: 1 },
    { id: 'zodiacPerfectFirewood', name: 'HQ Perfect Firewood', category: 'Zodiac', needed: 1 },
    { id: 'zodiacFurnaceRing', name: 'HQ Furnace Ring', category: 'Zodiac', needed: 1 },
    { id: 'zodiacBrassKettle', name: 'Brass Kettle', category: 'Zodiac', needed: 1 },
    { id: 'zodiacEelPie', name: 'HQ Tailor-made Eel Pie', category: 'Zodiac', needed: 1 },
    { id: 'zodiacPerfectCloth', name: 'HQ Perfect Cloth', category: 'Zodiac', needed: 1 },
    { id: 'zodiacAllaganResin', name: 'Allagan Resin', category: 'Zodiac', needed: 1 },
    { id: 'zodiacPerfectMortar', name: 'HQ Perfect Mortar', category: 'Zodiac', needed: 1 },
    { id: 'zodiacPerfectPestle', name: 'HQ Perfect Pestle', category: 'Zodiac', needed: 1 },
    { id: 'zodiacFuriteSand', name: 'Furite Sand', category: 'Zodiac', needed: 1 },
    { id: 'zodiacPerfectVellum', name: 'HQ Perfect Vellum', category: 'Zodiac', needed: 1 },
    { id: 'zodiacPerfectPounce', name: 'HQ Perfect Pounce', category: 'Zodiac', needed: 1 },
    { id: 'zetaMahatma', name: 'Mahatma', category: 'Zeta', needed: 12 },
  ], []);

  const calculateNeeded = useCallback((material: {id: string, needed: number}): number => {
    switch(material.id) {
      case 'relicQuenchingOil': return material.needed * JOBS_COUNT
      case 'zenithThavMist': return material.needed * JOBS_COUNT
      case 'atma': return material.needed * JOBS_COUNT
      case 'animusBooks': return material.needed * JOBS_COUNT
      case 'novusInk': return material.needed * JOBS_COUNT
      case 'novusMateria': return material.needed * JOBS_COUNT
      case 'novusAlexandrite': return material.needed * JOBS_COUNT
      case 'zodiacBombardCore': return material.needed * JOBS_COUNT
      case 'zodiacSacredWater': return material.needed * JOBS_COUNT
      case 'zodiacBronzeLakeCristal': return material.needed * JOBS_COUNT
      case 'zodiacPerfectFirewood': return material.needed * JOBS_COUNT
      case 'zodiacFurnaceRing': return material.needed * JOBS_COUNT
      case 'zodiacBrassKettle': return material.needed * JOBS_COUNT
      case 'zodiacEelPie': return material.needed * JOBS_COUNT
      case 'zodiacPerfectCloth': return material.needed * JOBS_COUNT
      case 'zodiacAllaganResin': return material.needed * JOBS_COUNT
      case 'zodiacPerfectMortar': return material.needed * JOBS_COUNT
      case 'zodiacPerfectPestle': return material.needed * JOBS_COUNT
      case 'zodiacFuriteSand': return material.needed * JOBS_COUNT
      case 'zodiacPerfectVellum': return material.needed * JOBS_COUNT
      case 'zodiacPerfectPounce': return material.needed * JOBS_COUNT
      case 'zetaMahatma': return material.needed * JOBS_COUNT
      default: return 0;
    }
  }, [weaponCounts]);

  const calculateTotalMaterials = useCallback((material: {id: string, needed: number}, held: number) => {
    switch(material.id) {
      case 'relicQuenchingOil': return material.needed * weaponCounts['step1'] + held;
      case 'zenithThavMist': return material.needed * weaponCounts['step2'] + held;
      case 'atma': return material.needed * weaponCounts['step3'] + held;
      case 'animusBooks': return material.needed * weaponCounts['step4'] + held;
      case 'novusInk': return material.needed * weaponCounts['step5'] + held;
      case 'novusMateria': return material.needed * weaponCounts['step5'] + held;
      case 'novusAlexandrite': return material.needed * weaponCounts['step5'] + held;
      case 'zodiacBombardCore': return material.needed * weaponCounts['step7'] + held;
      case 'zodiacSacredWater': return material.needed * weaponCounts['step7'] + held;
      case 'zodiacBronzeLakeCristal': return material.needed * weaponCounts['step7'] + held;
      case 'zodiacPerfectFirewood': return material.needed * weaponCounts['step7'] + held;
      case 'zodiacFurnaceRing': return material.needed * weaponCounts['step7'] + held;
      case 'zodiacBrassKettle': return material.needed * weaponCounts['step7'] + held;
      case 'zodiacEelPie': return material.needed * weaponCounts['step7'] + held;
      case 'zodiacPerfectCloth': return material.needed * weaponCounts['step7'] + held;
      case 'zodiacAllaganResin': return material.needed * weaponCounts['step7'] + held;
      case 'zodiacPerfectMortar': return material.needed * weaponCounts['step7'] + held;
      case 'zodiacPerfectPestle': return material.needed * weaponCounts['step7'] + held;
      case 'zodiacFuriteSand': return material.needed * weaponCounts['step7'] + held;
      case 'zodiacPerfectVellum': return material.needed * weaponCounts['step7'] + held;
      case 'zodiacPerfectPounce': return material.needed * weaponCounts['step7'] + held;
      case 'zetaMahatma': return material.needed * weaponCounts['step8'] + held;
      default: return 0;
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
      localStorage.setItem("zodiacInventory", JSON.stringify(newInventory));
      return newInventory;
    });
  }, []);


  return (
    <div className="p-16 space-y-6">
      <h1 className="text-2xl font-bold">Zodiac Weapons Progress</h1>
      
      <div className="flex justify-between gap-16">
      <WeaponsTable 
        weapons={weapons} 
        steps={steps} 
        storageKey="zodiacWeaponProgress"
        onToggleChange={handleToggleChange} 
      />

      <InventoryTable 
        inventoryType="Weapon"
        materials={materialData} 
        onInventoryChange={handleInventoryChange} 
        isLoading={isLoading}
      />
      </div>
      
    </div>
  );
}