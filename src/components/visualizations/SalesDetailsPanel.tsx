import { AnimatePresence, motion } from 'framer-motion';
import { X, Calendar, Users, Building2, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Lead {
  name: string;
  company: string;
  status: string;
  time: string;
}

interface Meeting {
  name: string;
  company: string;
  time: string;
  date: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

interface Deal {
  name: string;
  company: string;
  value: number;
  date: string;
  status: 'won' | 'lost';
}

interface SalesDetailsPanelProps {
  type: 'leads' | 'meetings' | 'deals';
  isVisible: boolean;
  onClose: () => void;
}

const leads: Lead[] = [
  { name: 'Sarah Chen', company: 'Digital Ocean', status: 'New', time: '2m ago' },
  { name: 'Michael Park', company: 'Stripe', status: 'Follow-up', time: '1h ago' },
  { name: 'Emma Wilson', company: 'Netflix', status: 'New', time: '3h ago' },
  { name: 'James Miller', company: 'Adobe', status: 'Qualified', time: '5h ago' },
  { name: 'Lisa Wang', company: 'Microsoft', status: 'New', time: '6h ago' },
  { name: 'David Kim', company: 'Apple', status: 'Follow-up', time: '8h ago' },
];

const meetings: Meeting[] = [
  { name: 'John Smith', company: 'AWS', time: '2:30 PM', date: '2024-03-01', status: 'scheduled' },
  { name: 'Anna Lee', company: 'Google', time: '4:00 PM', date: '2024-03-02', status: 'scheduled' },
  { name: 'Tom Wilson', company: 'Meta', time: '10:00 AM', date: '2024-03-03', status: 'scheduled' },
  { name: 'Sarah Park', company: 'IBM', time: '1:00 PM', date: '2024-02-28', status: 'completed' },
  { name: 'Mike Johnson', company: 'Oracle', time: '11:30 AM', date: '2024-02-27', status: 'completed' },
];

const deals: Deal[] = [
  { name: 'Enterprise Plan', company: 'Shopify', value: 15000, date: '2024-03-01', status: 'won' },
  { name: 'Team License', company: 'Atlassian', value: 8500, date: '2024-02-28', status: 'won' },
  { name: 'Custom Solution', company: 'Salesforce', value: 12000, date: '2024-02-25', status: 'won' },
  { name: 'Annual License', company: 'Twitter', value: 9500, date: '2024-02-20', status: 'won' },
  { name: 'Enterprise Deal', company: 'LinkedIn', value: 20000, date: '2024-02-15', status: 'won' },
];

export function SalesDetailsPanel({ type, isVisible, onClose }: SalesDetailsPanelProps) {
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
      setViewportHeight(window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const panelWidth = viewportWidth < 640 ? '85vw' : '320px';
  const maxHeight = viewportHeight - 120;

  const renderContent = () => {
    switch (type) {
      case 'leads':
        return leads.map((lead, index) => (
          <motion.div
            key={`${lead.company}-${index}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white/5 rounded-lg p-3"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="text-white font-medium text-sm">{lead.name}</div>
                <div className="flex items-center gap-1 text-white/60 text-xs">
                  <Building2 size={12} />
                  {lead.company}
                </div>
              </div>
              <div className="text-xs font-medium text-[#4488ff]">{lead.status}</div>
            </div>
            <div className="flex items-center gap-1 text-white/40 text-xs">
              <Clock size={12} />
              {lead.time}
            </div>
          </motion.div>
        ));

      case 'meetings':
        return meetings.map((meeting, index) => (
          <motion.div
            key={`${meeting.company}-${index}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white/5 rounded-lg p-3"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="text-white font-medium text-sm">{meeting.name}</div>
                <div className="flex items-center gap-1 text-white/60 text-xs">
                  <Building2 size={12} />
                  {meeting.company}
                </div>
              </div>
              <div className={`text-xs font-medium ${
                meeting.status === 'scheduled' ? 'text-[#44ff88]' : 
                meeting.status === 'completed' ? 'text-[#4488ff]' : 
                'text-[#ff4444]'
              }`}>
                {meeting.status}
              </div>
            </div>
            <div className="flex items-center justify-between text-white/40 text-xs">
              <div className="flex items-center gap-1">
                <Calendar size={12} />
                {new Date(meeting.date).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-1">
                <Clock size={12} />
                {meeting.time}
              </div>
            </div>
          </motion.div>
        ));

      case 'deals':
        return deals.map((deal, index) => (
          <motion.div
            key={`${deal.company}-${index}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white/5 rounded-lg p-3"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="text-white font-medium text-sm">{deal.name}</div>
                <div className="flex items-center gap-1 text-white/60 text-xs">
                  <Building2 size={12} />
                  {deal.company}
                </div>
              </div>
              <div className="text-sm font-medium text-[#44ff88]">
                ${deal.value.toLocaleString()}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-white/40 text-xs">
                <Calendar size={12} />
                {new Date(deal.date).toLocaleDateString()}
              </div>
              <div className={`text-xs font-medium ${
                deal.status === 'won' ? 'text-[#44ff88]' : 'text-[#ff4444]'
              }`}>
                {deal.status.toUpperCase()}
              </div>
            </div>
          </motion.div>
        ));
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="fixed right-4 top-4 z-50"
          style={{ width: panelWidth }}
        >
          <motion.div
            className="bg-black/40 backdrop-blur-sm rounded-xl p-4"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
            style={{ maxHeight }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[#4488ff] text-sm font-medium">
                {type === 'leads' ? 'New Leads' : 
                 type === 'meetings' ? 'Scheduled Meetings' : 
                 'Closed Deals'}
              </h2>
              <motion.button
                onClick={onClose}
                className="text-white/80 hover:text-white"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={16} />
              </motion.button>
            </div>

            <div 
              className="space-y-2 overflow-y-auto custom-scrollbar pr-2" 
              style={{ maxHeight: maxHeight - 80 }}
            >
              {renderContent()}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}