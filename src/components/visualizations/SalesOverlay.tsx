import { AnimatePresence, motion } from 'framer-motion';
import { X, Users, CalendarCheck, TrendingUp, ArrowUpRight } from 'lucide-react';
import { useDashboardStore } from '../../store';
import { useState, useEffect } from 'react';
import { SalesDetailsPanel } from './SalesDetailsPanel';
import { SalesVisualization } from './SalesVisualization';

export function SalesOverlay() {
  const [isVisible, setIsVisible] = useState(false);
  const [detailsType, setDetailsType] = useState<'leads' | 'meetings' | 'deals' | null>(null);
  const selectedUnit = useDashboardStore((state) => state.selectedUnit);

  useEffect(() => {
    setIsVisible(selectedUnit === 'sales');
    if (selectedUnit !== 'sales') {
      setDetailsType(null);
    }
  }, [selectedUnit]);

  const handleClose = () => {
    setIsVisible(false);
    useDashboardStore.getState().setSelectedUnit(null);
  };

  const handleDetailsClick = (type: 'leads' | 'meetings' | 'deals') => {
    setDetailsType(detailsType === type ? null : type);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed left-4 top-4 z-50 w-[280px]"
          >
            <motion.div
              className="rounded-xl bg-black/40 backdrop-blur-sm p-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-sm bg-[#4488ff]/20 flex items-center justify-center">
                    <TrendingUp size={12} className="text-[#4488ff]" />
                  </div>
                  <h2 className="text-[#4488ff] text-sm font-medium">Sales Overview</h2>
                </div>
                <button
                  onClick={handleClose}
                  className="text-white/80 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="text-3xl font-bold text-white mb-4">$47,280</div>

              <div className="relative h-[180px] rounded-lg mb-4 overflow-hidden">
                <SalesVisualization detailsType={detailsType} />
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <motion.button 
                  className="text-left"
                  onClick={() => handleDetailsClick('leads')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-[#4488ff]" />
                    <span className="text-white/60 text-xs">New Leads</span>
                  </div>
                  <div className="text-xl font-bold text-white">24</div>
                  <div className="flex items-center gap-1 text-[#44ff88] text-xs">
                    <ArrowUpRight size={12} />
                    <span>12%</span>
                  </div>
                </motion.button>

                <motion.button 
                  className="text-left"
                  onClick={() => handleDetailsClick('meetings')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-[#44ff88]" />
                    <span className="text-white/60 text-xs">Meetings</span>
                  </div>
                  <div className="text-xl font-bold text-white">8</div>
                  <div className="flex items-center gap-1 text-[#44ff88] text-xs">
                    <ArrowUpRight size={12} />
                    <span>8%</span>
                  </div>
                </motion.button>

                <motion.button 
                  className="text-left"
                  onClick={() => handleDetailsClick('deals')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-[#ff4444]" />
                    <span className="text-white/60 text-xs">Closed</span>
                  </div>
                  <div className="text-xl font-bold text-white">5</div>
                  <div className="flex items-center gap-1 text-[#44ff88] text-xs">
                    <ArrowUpRight size={12} />
                    <span>15%</span>
                  </div>
                </motion.button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-white bg-black/20 rounded-lg p-2">
                  <div className="flex items-center gap-2">
                    <Users size={14} className="text-[#4488ff]" />
                    <div className="text-xs">New lead: Digital Ocean</div>
                  </div>
                  <div className="text-xs font-medium text-[#4488ff]">2m ago</div>
                </div>
                <div className="flex items-center justify-between text-white bg-black/20 rounded-lg p-2">
                  <div className="flex items-center gap-2">
                    <CalendarCheck size={14} className="text-[#44ff88]" />
                    <div className="text-xs">Meeting with AWS today</div>
                  </div>
                  <div className="text-xs font-medium text-[#44ff88]">2:30 PM</div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <SalesDetailsPanel 
            type={detailsType || 'leads'} 
            isVisible={detailsType !== null}
            onClose={() => setDetailsType(null)}
          />
        </>
      )}
    </AnimatePresence>
  );
}