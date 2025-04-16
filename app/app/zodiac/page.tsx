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

  const ARR_JOBS_COUNT = 10;

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
    { id: 'relicQuenchingOil', name: 'Radz-at-Han Quenching Oil', category: 'Relic' },
    { id: 'zenithThavMist', name: 'Thavnairian Mist', category: 'Zenith' },
    { id: 'atma', name: 'Atmas', category: 'Atma' },
    { id: 'animusBooks', name: 'Books', category: 'Animus' },
    { id: 'novusInk', name: 'Novus Ink', category: 'Novus' },
    { id: 'novusMateria', name: 'Novus Materia', category: 'Novus' },
    { id: 'novusAlexandrite', name: 'Novus Alexandrite', category: 'Novus' },
    { id: 'zodiacBombardCore', name: 'Bombard Core', category: 'Zodiac' },
    { id: 'zodiacSacredWater', name: 'Sacred Spring Water', category: 'Zodiac' },
    { id: 'zodiacBronzeLakeCristal', name: 'Bronze Lake Crystal', category: 'Zodiac' },
    { id: 'zodiacPerfectFirewood', name: 'HQ Perfect Firewood', category: 'Zodiac' },
    { id: 'zodiacFurnaceRing', name: 'HQ Furnace Ring', category: 'Zodiac' },
    { id: 'zodiacBrassKettle', name: 'Brass Kettle', category: 'Zodiac' },
    { id: 'zodiacEelPie', name: 'HQ Tailor-made Eel Pie', category: 'Zodiac' },
    { id: 'zodiacPerfectCloth', name: 'HQ Perfect Cloth', category: 'Zodiac' },
    { id: 'zodiacAllaganResin', name: 'Allagan Resin', category: 'Zodiac' },
    { id: 'zodiacPerfectMortar', name: 'HQ Perfect Mortar', category: 'Zodiac' },
    { id: 'zodiacPerfectPestle', name: 'HQ Perfect Pestle', category: 'Zodiac' },
    { id: 'zodiacFuriteSand', name: 'Furite Sand', category: 'Zodiac' },
    { id: 'zodiacPerfectVellum', name: 'HQ Perfect Vellum', category: 'Zodiac' },
    { id: 'zodiacPerfectPounce', name: 'HQ Perfect Pounce', category: 'Zodiac' },
    { id: 'zetaMahatma', name: 'Mahatma', category: 'Zeta' },
  ], []);

  const materialData = useMemo(() => {
    return materials.map(material => {
      const needed = calculateNeeded(material.id);
      const held = inventory[material.id] || 0;
      const remaining = Math.max(0, needed - held);
      const progress = needed > 0 ? Math.min(100, (held / needed) * 100) : 100;

      return {
        ...material,
        needed,
        held,
        remaining,
        progress
      };
    });
  }, [inventory, weaponCounts, materials]);

  function calculateNeeded(materialId: string): number {
    switch(materialId) {
      case 'relicQuenchingOil': return ARR_JOBS_COUNT - (weaponCounts['step1'] || 0);
      case 'zenithThavMist': return 5 * (ARR_JOBS_COUNT - (weaponCounts['step2'] || 0));
      case 'atma': return 12 * (ARR_JOBS_COUNT - (weaponCounts['step3'] || 0));
      case 'animusBooks': return 9 * (ARR_JOBS_COUNT - (weaponCounts['step4'] || 0));
      case 'novusInk': return 3 * (ARR_JOBS_COUNT - (weaponCounts['step5'] || 0));
      case 'novusMateria': return 75 * (ARR_JOBS_COUNT - (weaponCounts['step5'] || 0));
      case 'novusAlexandrite': return 75 * (ARR_JOBS_COUNT - (weaponCounts['step5'] || 0));
      case 'zodiacBombardCore': return 4 * (ARR_JOBS_COUNT - (weaponCounts['step6'] || 0));
      case 'zodiacSacredWater': return 4 * (ARR_JOBS_COUNT - (weaponCounts['step7'] || 0));
      case 'zodiacBronzeLakeCristal': return 1 * (ARR_JOBS_COUNT - (weaponCounts['step7'] || 0));
      case 'zodiacPerfectFirewood': return 1 * (ARR_JOBS_COUNT - (weaponCounts['step7'] || 0));
      case 'zodiacFurnaceRing': return 1 * (ARR_JOBS_COUNT - (weaponCounts['step7'] || 0));
      case 'zodiacBrassKettle': return 1 * (ARR_JOBS_COUNT - (weaponCounts['step7'] || 0));
      case 'zodiacEelPie': return 1 * (ARR_JOBS_COUNT - (weaponCounts['step7'] || 0));
      case 'zodiacPerfectCloth': return 1 * (ARR_JOBS_COUNT - (weaponCounts['step7'] || 0));
      case 'zodiacAllaganResin': return 1 * (ARR_JOBS_COUNT - (weaponCounts['step7'] || 0));
      case 'zodiacPerfectMortar': return 1 * (ARR_JOBS_COUNT - (weaponCounts['step7'] || 0));
      case 'zodiacPerfectPestle': return 1 * (ARR_JOBS_COUNT - (weaponCounts['step7'] || 0));
      case 'zodiacFuriteSand': return 1 * (ARR_JOBS_COUNT - (weaponCounts['step7'] || 0));
      case 'zodiacPerfectVellum': return 1 * (ARR_JOBS_COUNT - (weaponCounts['step7'] || 0));
      case 'zodiacPerfectPounce': return 1 * (ARR_JOBS_COUNT - (weaponCounts['step7'] || 0));
      case 'zetaMahatma': return 12 * (ARR_JOBS_COUNT - (weaponCounts['step8'] || 0));
      default: return 0;
    }
  }

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
        materials={materialData} 
        onInventoryChange={handleInventoryChange} 
        isLoading={isLoading}
      />
      </div>
      
    </div>
  );
}