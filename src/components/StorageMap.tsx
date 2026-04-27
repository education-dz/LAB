import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { Package, MapPin } from 'lucide-react';

interface Chemical {
  id: string;
  nameAr: string;
  nameEn: string;
  shelf: string;
  quantity: number;
  unit: string;
}

interface StorageMapProps {
  chemicals: Chemical[];
}

export default function StorageMap({ chemicals }: StorageMapProps) {
  // Extract unique shelves and group chemicals
  const shelfMap: Record<string, Chemical[]> = {};
  chemicals.forEach(chem => {
    const shelf = chem.shelf || "غير مصنف";
    if (!shelfMap[shelf]) shelfMap[shelf] = [];
    shelfMap[shelf].push(chem);
  });

  const shelves = Object.keys(shelfMap).sort();

  return (
    <div className="bg-surface-container-low rounded-[32px] p-8 border border-outline/10">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-primary/10 rounded-xl text-primary">
          <MapPin size={24} />
        </div>
        <div>
          <h3 className="text-xl font-black text-primary">المخطط الصوري للمخزن</h3>
          <p className="text-xs font-bold text-secondary">توزيع المواد حسب الرفوف الفعلية</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {shelves.map((shelf) => (
          <motion.div 
            key={shelf}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-surface border border-outline/10 rounded-2xl shadow-sm overflow-hidden flex flex-col"
          >
            <div className="bg-primary/5 p-4 border-b border-outline/5 flex justify-between items-center">
              <h4 className="font-black text-primary flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                الرف: {shelf}
              </h4>
              <span className="text-[10px] font-black bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                {shelfMap[shelf].length} مواد
              </span>
            </div>
            
            <div className="p-4 space-y-3 flex-1 overflow-y-auto max-h-48 custom-scrollbar">
              {shelfMap[shelf].map((chem) => (
                <div key={chem.id} className="flex justify-between items-center group">
                  <div className="flex items-center gap-2">
                    <Package size={14} className="text-secondary opacity-40 group-hover:opacity-100 transition-opacity" />
                    <span className="text-xs font-bold text-secondary truncate max-w-[120px]" title={chem.nameAr}>
                      {chem.nameAr}
                    </span>
                  </div>
                  <span className={cn(
                    "text-[10px] font-black px-2 py-0.5 rounded-sm",
                    chem.quantity <= 5 ? "bg-error/10 text-error" : "bg-secondary/10 text-secondary"
                  )}>
                    {chem.quantity} {chem.unit}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-3 bg-surface-container-lowest border-t border-outline/5 mt-auto">
              <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-1000" 
                  style={{ width: `${Math.min(100, (shelfMap[shelf].length / 15) * 100)}%` }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {shelves.length === 0 && (
        <div className="py-20 text-center text-secondary/40">
          <Package size={48} className="mx-auto mb-4 opacity-20" />
          <p className="font-bold">لم يتم تحديد أي رفوف للمواد بعد.</p>
        </div>
      )}
    </div>
  );
}
