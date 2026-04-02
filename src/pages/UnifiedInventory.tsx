import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Package, 
  FlaskConical, 
  Monitor, 
  Beaker, 
  Trash2, 
  ClipboardList,
  ArrowRight,
  Search,
  Filter,
  LayoutGrid,
  List as ListIcon,
  Sparkles
} from 'lucide-react';
import { cn } from '../lib/utils';
import Chemicals from './Chemicals';
import Equipment from './Equipment';
import TechInventory from './TechInventory';
import GlasswareBreakage from './GlasswareBreakage';
import ChemicalWaste from './ChemicalWaste';
import ConsumablesSDS from './ConsumablesSDS';

type InventoryTab = 'chemicals' | 'equipment' | 'tech' | 'glassware' | 'waste' | 'consumables';

const tabs: { id: InventoryTab; label: string; icon: any; color: string }[] = [
  { id: 'chemicals', label: 'الكواشف الكيميائية', icon: FlaskConical, color: 'text-primary' },
  { id: 'equipment', label: 'جرد التجهيزات', icon: Package, color: 'text-primary' },
  { id: 'tech', label: 'التجهيزات التقنية', icon: Monitor, color: 'text-primary' },
  { id: 'glassware', label: 'الزجاجيات والكسور', icon: Beaker, color: 'text-primary' },
  { id: 'consumables', label: 'المستهلكات & SDS', icon: ClipboardList, color: 'text-primary' },
  { id: 'waste', label: 'النفايات الكيميائية', icon: Trash2, color: 'text-error' },
];

export default function UnifiedInventory() {
  const [activeTab, setActiveTab] = useState<InventoryTab>('chemicals');

  const renderContent = () => {
    switch (activeTab) {
      case 'chemicals': return <Chemicals isNested={true} />;
      case 'equipment': return <Equipment isNested={true} />;
      case 'tech': return <TechInventory isNested={true} />;
      case 'glassware': return <GlasswareBreakage isNested={true} />;
      case 'waste': return <ChemicalWaste isNested={true} />;
      case 'consumables': return <ConsumablesSDS isNested={true} />;
      default: return <Chemicals isNested={true} />;
    }
  };

  return (
    <div className="min-h-screen bg-surface-container-lowest pb-20 rtl font-sans" dir="rtl">
      {/* Header Section */}
      <header className="bg-white border-b border-outline/10 pt-12 pb-8 px-8 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-black uppercase tracking-widest">
                <Sparkles size={14} />
                نظام الجرد الموحد
              </div>
              <h1 className="text-4xl font-black text-primary tracking-tight font-serif">مركز الجرد الشامل</h1>
              <p className="text-on-surface/60 font-bold">إدارة جميع ممتلكات المخبر من واجهة واحدة ذكية</p>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-3 px-6 py-4 rounded-2xl font-black transition-all whitespace-nowrap border-2",
                    isActive 
                      ? "bg-primary text-on-primary border-primary shadow-xl shadow-primary/20 scale-105" 
                      : "bg-surface-container-low text-on-surface/60 border-transparent hover:bg-surface-container-high"
                  )}
                >
                  <Icon size={20} className={isActive ? "text-on-primary" : tab.color} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-8 pt-12">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-[40px] shadow-2xl shadow-primary/5 border border-outline/5 overflow-hidden"
        >
          {/* We wrap the original pages. Note: Original pages might have their own headers/paddings. 
              We might need to adjust them to fit better in this unified view. */}
          <div className="p-0">
            {renderContent()}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
