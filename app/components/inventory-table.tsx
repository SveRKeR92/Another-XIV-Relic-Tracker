"use client";

import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";

interface Inventory {
  id: string;
  name: string;
  category: string;
  needed: number;
  held: number;
  remaining: number;
  progress: number;
}

interface InventoryProps {
  materials: Inventory[];
  onInventoryChange: (materialId: string, value: number) => void;
  isLoading?: boolean;
}

export function InventoryTable({ materials, onInventoryChange, isLoading }: InventoryProps) {

if (isLoading) {
    return <Skeleton className="h-96 w-200" />;
}

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Material</TableHead>
            <TableHead className="text-right">Held</TableHead>
            <TableHead className="text-right">Remaining</TableHead>
            <TableHead className="text-right">Per Weapon</TableHead>
            <TableHead className="text-right">Progress</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {materials.map((material) => (
            <TableRow key={material.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{material.category}</span>
                  {material.name}
                </div>
              </TableCell>
              <TableCell className="text-right flex items-center justify-end">
                <Input
                  type="number"
                  min="0"
                  value={material.held}
                  onChange={(e) => onInventoryChange(material.id, parseInt(e.target.value) || 0)}
                  className="w-20 text-right"
                />
              </TableCell>
              <TableCell className="text-right">
                <span className={material.remaining > 0 ? "text-red-500" : "text-green-500"}>
                  {material.remaining}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <span className="text-sm text-muted-foreground w-10">
                  {material.needed}
                </span>
              </TableCell>
              <TableCell className="text-right flex items-center justify-end w-24">
                <Progress
                  value={material.progress}
                />
                <span className="text-sm text-muted-foreground w-10">
                  {material.progress.toFixed(0)}%
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}