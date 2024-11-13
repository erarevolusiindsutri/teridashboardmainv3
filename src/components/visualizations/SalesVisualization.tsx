import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface SalesVisualizationProps {
  detailsType: 'leads' | 'meetings' | 'deals' | null;
}

// Mock data for visualization
const mockData = {
  meetings: {
    '2024-03-01': [{ time: '14:30', company: 'AWS' }],
    '2024-03-02': [{ time: '16:00', company: 'Google' }],
    '2024-03-03': [{ time: '10:00', company: 'Meta' }],
    '2024-03-05': [{ time: '11:30', company: 'Oracle' }],
    '2024-03-08': [{ time: '15:00', company: 'Microsoft' }],
  },
  leads: {
    '2024-03-01': 2,
    '2024-03-02': 1,
    '2024-03-04': 3,
    '2024-03-06': 2,
    '2024-03-07': 1,
    '2024-03-09': 2,
  }
};

export function SalesVisualization({ detailsType }: SalesVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isTimeView, setIsTimeView] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawCalendar = () => {
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      
      // Adjust sizes to fit container better
      const cellSize = 24;
      const cellPadding = 2;
      const totalSize = cellSize + cellPadding;
      const startX = 20;
      const startY = 30;

      // Clear canvas with semi-transparent background
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw day labels
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = '10px Inter';
      ctx.textAlign = 'center';
      days.forEach((day, i) => {
        ctx.fillText(day, startX + i * totalSize + cellSize/2, startY - 10);
      });

      let day = 1;
      const rows = Math.ceil((daysInMonth + firstDay) / 7);

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < 7; col++) {
          if (row === 0 && col < firstDay) continue;
          if (day > daysInMonth) break;

          const x = startX + (col * totalSize);
          const y = startY + (row * totalSize);
          const dateStr = `2024-03-${day.toString().padStart(2, '0')}`;
          
          // Draw cell background
          ctx.fillStyle = 'rgba(68, 136, 255, 0.05)';
          ctx.fillRect(x, y, cellSize, cellSize);
          
          // Draw cell border
          ctx.strokeStyle = 'rgba(68, 136, 255, 0.1)';
          ctx.strokeRect(x, y, cellSize, cellSize);

          // Draw day number
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.font = '10px Inter';
          ctx.textAlign = 'left';
          ctx.fillText(day.toString(), x + 4, y + 14);

          // Draw indicators
          if (detailsType === 'meetings' && mockData.meetings[dateStr]) {
            // Meeting indicator (green dot)
            ctx.beginPath();
            ctx.arc(x + cellSize - 6, y + 6, 2, 0, Math.PI * 2);
            ctx.fillStyle = '#44ff88';
            ctx.shadowColor = '#44ff88';
            ctx.shadowBlur = 8;
            ctx.fill();
            ctx.shadowBlur = 0;
          } else if (detailsType === 'leads' && mockData.leads[dateStr]) {
            // Lead indicator (blue glow based on count)
            const count = mockData.leads[dateStr];
            const intensity = Math.min(count / 4, 1);
            
            ctx.beginPath();
            ctx.arc(x + cellSize - 6, y + 6, 2, 0, Math.PI * 2);
            ctx.fillStyle = '#4488ff';
            ctx.shadowColor = '#4488ff';
            ctx.shadowBlur = 8 * intensity;
            ctx.fill();
            ctx.shadowBlur = 0;
          }

          // Highlight current day
          if (day === now.getDate()) {
            ctx.strokeStyle = '#44ff88';
            ctx.lineWidth = 1;
            ctx.strokeRect(x, y, cellSize, cellSize);
          }

          day++;
        }
      }
    };

    const drawTimeView = () => {
      if (!selectedDate || !mockData.meetings[selectedDate]) return;

      const meeting = mockData.meetings[selectedDate][0];
      const hour = parseInt(meeting.time.split(':')[0]);
      const minute = parseInt(meeting.time.split(':')[1]);

      // Clear canvas with semi-transparent background
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw time grid
      ctx.fillStyle = 'rgba(68, 255, 136, 0.1)';
      ctx.fillRect(30, 20, canvas.width - 60, canvas.height - 40);

      // Draw time markers
      for (let h = 9; h <= 17; h++) {
        const y = 20 + ((h - 9) * (canvas.height - 40) / 8);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.font = '10px Inter';
        ctx.textAlign = 'right';
        ctx.fillText(`${h}:00`, 25, y + 4);

        ctx.strokeStyle = 'rgba(68, 255, 136, 0.1)';
        ctx.beginPath();
        ctx.moveTo(30, y);
        ctx.lineTo(canvas.width - 30, y);
        ctx.stroke();
      }

      // Draw meeting indicator
      const meetingY = 20 + ((hour + minute/60 - 9) * (canvas.height - 40) / 8);
      
      ctx.beginPath();
      ctx.arc(canvas.width/2, meetingY, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#44ff88';
      ctx.shadowColor = '#44ff88';
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw meeting details
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(`${meeting.time} - ${meeting.company}`, canvas.width/2, meetingY - 10);
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (isTimeView) {
        drawTimeView();
      } else {
        drawCalendar();
      }
    };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      render();
    };

    window.addEventListener('resize', resize);
    resize();

    return () => window.removeEventListener('resize', resize);
  }, [detailsType, isTimeView, selectedDate]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || detailsType !== 'meetings') return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isTimeView) {
      setIsTimeView(false);
      setSelectedDate(null);
      return;
    }

    // Calculate which day was clicked
    const cellSize = 24;
    const cellPadding = 2;
    const totalSize = cellSize + cellPadding;
    const startX = 20;
    const startY = 30;

    const col = Math.floor((x - startX) / totalSize);
    const row = Math.floor((y - startY) / totalSize);

    if (col >= 0 && col < 7 && row >= 0) {
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
      const day = row * 7 + col - firstDay + 1;
      
      if (day > 0) {
        const dateStr = `2024-03-${day.toString().padStart(2, '0')}`;
        if (mockData.meetings[dateStr]) {
          setSelectedDate(dateStr);
          setIsTimeView(true);
        }
      }
    }
  };

  return (
    <motion.canvas
      ref={canvasRef}
      className="w-full h-full cursor-pointer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      onClick={handleClick}
    />
  );
}