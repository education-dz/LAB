import { useState } from 'react';
import { motion } from 'motion/react';
import { useMotionPrefs, presets } from '../lib/animations';
import { cn } from '../lib/utils';
import { Check, X } from 'lucide-react';

export default function DesignSystem() {
  const animations = useMotionPrefs();
  const [activeTab, setActiveTab] = useState('colors');

  const colorPalettes = [
    {
      name: 'Primary (Nature/Matcha)',
      tokens: ['primary', 'primary-container', 'primary-fixed', 'on-primary', 'on-primary-container'],
      twPrefix: 'bg',
    },
    {
      name: 'Secondary (Earthy/Olive)',
      tokens: ['secondary', 'secondary-container', 'secondary-fixed', 'on-secondary', 'on-secondary-container'],
      twPrefix: 'bg',
    },
    {
      name: 'Tertiary (Warm/Wood)',
      tokens: ['tertiary', 'tertiary-container', 'tertiary-fixed', 'on-tertiary', 'on-tertiary-container'],
      twPrefix: 'bg',
    },
    {
      name: 'Surface & Background (Paper)',
      tokens: ['background', 'surface', 'surface-container', 'surface-variant', 'on-surface', 'on-surface-variant'],
      twPrefix: 'bg',
    },
    {
      name: 'Semantic (Alert/Error)',
      tokens: ['error', 'error-container', 'on-error', 'on-error-container'],
      twPrefix: 'bg',
    }
  ];

  const typographyMap = [
    { name: 'Display / Page Title', class: 'font-sans text-4xl font-black tracking-tight text-primary' },
    { name: 'Heading 1', class: 'font-sans text-2xl font-bold tracking-tight text-on-surface' },
    { name: 'Heading 2', class: 'font-sans text-xl font-bold text-on-surface' },
    { name: 'Code / Technical', class: 'font-mono text-sm font-medium text-secondary' },
    { name: 'Body Large', class: 'font-sans text-lg font-medium text-on-surface-variant' },
    { name: 'Body Regular', class: 'font-sans text-base text-on-surface-variant' },
    { name: 'Caption / Meta', class: 'font-sans text-xs font-bold uppercase tracking-widest text-outline' },
  ];

  return (
    <motion.div 
      className="max-w-6xl mx-auto space-y-12 pb-24"
      variants={animations.pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <header className="space-y-4">
        <h1 className="text-4xl font-black text-primary tracking-tight">Design System</h1>
        <p className="text-on-surface-variant text-lg max-w-2xl">
          Tokens, components, and layout patterns for the Algerian Educational Laboratory system.
          Built with Material Design 3 principles and tailored to a warm, organic color narrative.
        </p>
      </header>

      <div className="flex gap-4 border-b border-outline/20 pb-4">
        {['colors', 'typography', 'components', 'motion'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-6 py-2 rounded-full font-bold capitalize transition-all",
              activeTab === tab 
                ? "bg-primary text-on-primary shadow-md" 
                : "text-on-surface-variant hover:bg-surface-container-high"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <motion.div 
        key={activeTab}
        variants={animations.pageTransition}
        initial="initial"
        animate="animate"
      >
        {activeTab === 'colors' && (
          <div className="space-y-12">
            {colorPalettes.map(palette => (
              <section key={palette.name} className="space-y-6">
                <h2 className="text-2xl font-bold text-on-surface">{palette.name}</h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {palette.tokens.map(token => (
                    <div key={token} className="space-y-2">
                      <div className={cn(`h-24 rounded-2xl shadow-sm border border-outline/10 bg-${token}`)}></div>
                      <div className="text-xs font-mono font-bold text-on-surface-variant p-1">
                        bg-{token}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {activeTab === 'typography' && (
          <div className="space-y-8">
            <div className="bg-surface-container-low p-8 rounded-[32px] border border-outline/10 space-y-8">
              {typographyMap.map(type => (
                <div key={type.name} className="grid md:grid-cols-4 gap-4 items-center border-b border-outline/5 pb-4 last:border-0">
                  <div className="text-xs font-bold tracking-widest uppercase text-outline">
                    {type.name}
                  </div>
                  <div className="md:col-span-3">
                    <div className={type.class}>
                      الجهاز الهضمي للإنسان - Human Digestive System
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'components' && (
          <div className="space-y-12">
            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-on-surface">Cards & Containers</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* Standard MD3 Card */}
                <div className="bg-surface p-8 rounded-[40px] border border-outline/10 shadow-ambient space-y-4">
                  <span className="text-[10px] font-black uppercase text-outline tracking-wider">Standard MD3 Card</span>
                  <h3 className="text-xl font-bold text-on-surface">Primary Surface</h3>
                  <p className="text-on-surface-variant font-medium">
                    Standard container using shadow-ambient and rounded-[40px] for major structural areas.
                  </p>
                </div>

                {/* Asymmetric Card */}
                <div className="asymmetric-card bg-primary-container p-8 border border-primary/20 shadow-lg space-y-4">
                  <span className="text-[10px] font-black uppercase text-on-primary-container tracking-wider">Asymmetric Expression</span>
                  <h3 className="text-xl font-bold text-primary">Special Feature Area</h3>
                  <p className="text-primary/80 font-medium">
                    Using the global .asymmetric-card utility class to break the grid visually.
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-on-surface">Interactive Elements</h2>
              
              <div className="bg-surface-container p-12 rounded-[40px] border border-outline/5 flex flex-wrap gap-8 items-center justify-center">
                <button className="px-8 py-4 bg-primary text-on-primary rounded-full font-black shadow-md hover:shadow-lg hover:-translate-y-1 transition-all">
                  Primary Action
                </button>
                <button className="px-8 py-4 bg-surface text-primary border border-outline/20 rounded-full font-black shadow-sm hover:bg-surface-container-high transition-all">
                  Secondary Action
                </button>
                <button className="px-8 py-4 bg-error-container text-on-error-container rounded-full font-black shadow-sm hover:bg-error hover:text-white transition-all">
                  Destructive
                </button>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'motion' && (
          <div className="space-y-12">
            <section className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-on-surface">Hover States (useMotionPrefs)</h3>
                <motion.div 
                  className="w-full h-48 bg-secondary-container rounded-[32px] border border-outline/10 flex items-center justify-center cursor-pointer"
                  variants={animations.hoverCard}
                  whileHover="whileHover"
                >
                  <span className="font-bold text-on-secondary-container">Hover me (Snappy Editorial Ease)</span>
                </motion.div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-bold text-on-surface">Staggered List Reveal</h3>
                <motion.div 
                  className="space-y-3"
                  variants={animations.staggerContainer}
                  initial="initial"
                  animate="animate"
                >
                  {[1,2,3].map(i => (
                    <motion.div 
                      key={i}
                      variants={animations.cardReveal}
                      className="bg-surface p-4 rounded-2xl border border-outline/5 shadow-sm flex items-center gap-4"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {i}
                      </div>
                      <div className="h-4 w-1/2 bg-outline/10 rounded-full"></div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </section>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
