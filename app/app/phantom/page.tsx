"use client";

import { WeaponsTable } from "@/components/weapons-table";
import { InventoryTable } from "@/components/inventory-table";
import { useState, useCallback, useMemo, useEffect } from "react";
import { ArmorsTable } from "@/components/armors-table";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function MandervilleTracker() {

  const [isLoading, setIsLoading] = useState(true);
  const [inventory, setInventory] = useState<Record<string, number>>({});
  const [weaponCounts, setWeaponCounts] = useState<Record<string, number>>({});
  const [armorInventory, setArmorInventory] = useState<Record<string, number>>({});
  const [armorCounts, setArmorCounts] = useState<Record<string, number>>({});

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
    { id: 'vpr', name: 'VPR' },
    { id: 'brd', name: 'BRD' },
    { id: 'mch', name: 'MCH' },
    { id: 'dnc', name: 'DNC' },
    { id: 'blm', name: 'BLM' },
    { id: 'smn', name: 'SMN' },
    { id: 'rdm', name: 'RDM' },
    { id: 'pct', name: 'PCT' },
  ];

  const steps = [
    { id: 'step1', name: 'Penumbrae' },
  ];


  const armors = [
    {id : 'tanks', name: 'Tanks'},
    {id : 'healers', name: 'Healers'},
    {id : 'melee1', name: 'MNK SAM'},
    {id : 'melee2', name: 'DRG RPR'},
    {id : 'melee3', name: 'NIN VPR'},
    {id : 'ranged', name: 'BRD MCH DNC'},
    {id : 'casters', name: 'BLM SMN RDM PCT'},
  ]

  const armorSteps = [
    { id: 'head1', name: 'Base Head' },
    { id: 'head2', name: 'Head +1' },
    { id: 'head3', name: 'Head +2' },
    { id: 'chest1', name: 'Base Chest' },
    { id: 'chest2', name: 'Chest +1' },
    { id: 'chest3', name: 'Chest +2' },
    { id: 'gloves1', name: 'Base Gloves' },
    { id: 'gloves2', name: 'Gloves +1' },
    { id: 'gloves3', name: 'Gloves +2' },
    { id: 'pants1', name: 'Base Pants' },
    { id: 'pants2', name: 'Pants +1' },
    { id: 'pants3', name: 'Pants +2' },
    { id: 'boots1', name: 'Base Boots' },
    { id: 'boots2', name: 'Boots +1' },
    { id: 'boots3', name: 'Boots +2' },
  ]

  const JOBS_COUNT = weapons.length;
  const ARMORS_COUNT = armors.length;

  // Initialize state from localStorage after mount
  useEffect(() => {
    setIsLoading(true);
    
    const savedInventory = localStorage.getItem("phantomWeaponInventory");
    const savedWeaponProgress = localStorage.getItem("phantomWeaponProgress");
    const savedArmorInventory = localStorage.getItem("phantomArmorInventory");
    const savedArmorProgress = localStorage.getItem("phantomArmorProgress");

    setInventory(savedInventory ? JSON.parse(savedInventory) : {
      arcanite: 0,
    });

    setArmorInventory(savedArmorInventory ? JSON.parse(savedArmorInventory) : {
      aetherspunSilver: 0,
      aetherialFixative: 0,
      aetherspunGold: 0,
      xFixative: 0,
    });

    if (savedWeaponProgress) {
      const data = JSON.parse(savedWeaponProgress);
      const counts: Record<string, number> = {};
      Object.entries(data).forEach(([stepId, weapons]) => {
        counts[stepId] = Object.values(weapons as Record<string, boolean>).filter(owned => owned).length;
      });
      setWeaponCounts(counts);
    }

    if (savedArmorProgress) {
      const data = JSON.parse(savedArmorProgress);
      const counts: Record<string, number> = {};
      Object.entries(data).forEach(([stepId, armors]) => {
        counts[stepId] = Object.values(armors as Record<string, boolean>).filter(owned => owned).length;
      });
      setArmorCounts(counts);
    }

    setIsLoading(false);
  }, []);

  // Stable callback that won't change between renders
  const handleToggleChange = useCallback((data: Record<string, Record<string, boolean>>) => {
    const counts: Record<string, number> = {};
    
    Object.entries(data).forEach(([stepId, weapons]) => {
      counts[stepId] = Object.values(weapons).filter(owned => owned).length;
    });

    setWeaponCounts(prev => {
      if (JSON.stringify(prev) === JSON.stringify(counts)) return prev;
      return counts;
    });
    localStorage.setItem("phantomWeaponProgress", JSON.stringify(data));
  }, []);

  // Calculate materials needed using useMemo to prevent unnecessary recalculations
  const materials = useMemo(() => [
    { id: 'demiatmas', name: 'Demiatmas (3 of each color)', category: 'Penumbrae', needed: 18 },
    { id: 'arcanite', name: 'Arcanite', category: 'Penumbrae', needed: 3 },
  ], []);

  const calculateNeeded = useCallback((material: {id: string, needed: number}): number => {
    switch(material.id) {
      case 'demiatmas': return 18;
      case 'arcanite': return material.needed * JOBS_COUNT;
      default: return 0;
    }
  }, [weaponCounts]);

  const calculateTotalMaterials = useCallback((material: {id: string, needed: number}, held: number): number => {
    switch(material.id) {
      case 'demiatmas': return held;
      case 'arcanite': return material.needed * weaponCounts['step1'] + held;
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
      localStorage.setItem("phantomWeaponInventory", JSON.stringify(newInventory));
      return newInventory;
    });
  }, []);

  // ***** Armor Section *****

  const handleArmorToggleChange = useCallback((data: Record<string, Record<string, boolean>>) => {
    const counts: Record<string, number> = {};
    
    Object.entries(data).forEach(([stepId, armors]) => {
      counts[stepId] = Object.values(armors).filter(owned => owned).length;
    });

    setArmorCounts(prev => {
      if (JSON.stringify(prev) === JSON.stringify(counts)) return prev;
      return counts;
    });
    localStorage.setItem("phantomArmorProgress", JSON.stringify(data));
  }, []);

  const armorMaterials = useMemo(() => [
    { id: 'aetherspunSilver', name: 'Aetherspun Silver', category: 'Phantom Armor', needed: 3 },
    { id: 'aetherialFixative', name: 'Aetherial Fixative', category: 'Phantom Armor', needed: 3 },
    { id: 'aetherspunGold', name: 'Aetherspun Gold', category: 'Phantom Armor', needed: 3 },
    { id: 'xFixative', name: 'X-Fixative', category: 'Phantom Armor', needed: 3 },
  ], []);

  const calculateArmorNeeded = useCallback((material: {id: string, needed: number}): number => {
    switch(material.id) {
      case 'aetherspunSilver': return material.needed * ARMORS_COUNT * 5;
      case 'aetherialFixative': return material.needed * ARMORS_COUNT * 5;
      case 'aetherspunGold': return material.needed * ARMORS_COUNT * 5;
      case 'xFixative': return material.needed * ARMORS_COUNT * 5;
      default: return 0;
    }
  }, [armorCounts]);

  const calculateTotalArmorMaterials = useCallback((material: {id: string, needed: number}, held: number): number => {
    switch(material.id) {
      case 'aetherspunSilver': return material.needed * (armorCounts['head2'] + armorCounts['chest2'] + armorCounts['gloves2'] + armorCounts['pants2'] + armorCounts['boots2']) + held;
      case 'aetherialFixative': return material.needed * (armorCounts['head2'] + armorCounts['chest2'] + armorCounts['gloves2'] + armorCounts['pants2'] + armorCounts['boots2']) + held;
      case 'aetherspunGold': return material.needed * (armorCounts['head3'] + armorCounts['chest3'] + armorCounts['gloves3'] + armorCounts['pants3'] + armorCounts['boots3']) + held;
      case 'xFixative': return material.needed * (armorCounts['head3'] + armorCounts['chest3'] + armorCounts['gloves3'] + armorCounts['pants3'] + armorCounts['boots3']) + held;
      default: return held;
    }
  }, [armorCounts]);
  
  const armorMaterialData = useMemo(() => {
    return armorMaterials.map(material => {
        const totalNeeded = calculateArmorNeeded(material);
        const held = armorInventory[material.id] || 0;
        const totalHeldMaterials = calculateTotalArmorMaterials(material, held);
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
  }, [armorInventory, armorMaterials, calculateArmorNeeded]);

  const handleArmorInventoryChange = useCallback((materialId: string, value: number) => {
    setArmorInventory(prev => {
      const newValue = Math.max(0, value);
      if (prev[materialId] === newValue) return prev;
      
      const newInventory = { ...prev, [materialId]: newValue };
      localStorage.setItem("phantomArmorInventory", JSON.stringify(newInventory));
      return newInventory;
    });
  }, []);

  return (
    <div className="p-16 space-y-6">
      <h1 className="text-2xl font-bold">Phantom Weapons Progress</h1>
      
      <div className="flex flex-col gap-8">
      <WeaponsTable 
        weapons={weapons} 
        steps={steps} 
        storageKey="phantomWeaponProgress"
        onToggleChange={handleToggleChange} 
      />

      <InventoryTable 
        materials={materialData} 
        onInventoryChange={handleInventoryChange} 
        isLoading={isLoading}
      />

      <Accordion type="single" collapsible >
        <AccordionItem value="item-1">
          <AccordionTrigger>Relic Armors</AccordionTrigger>
          <AccordionContent>
            <ArmorsTable
              armors={armors} 
              steps={armorSteps} 
              storageKey="phantomArmorProgress"
              onToggleChange={handleArmorToggleChange}
            />

            <InventoryTable 
              materials={armorMaterialData} 
              onInventoryChange={handleArmorInventoryChange} 
              isLoading={isLoading}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      </div>
      
    </div>
  );
}