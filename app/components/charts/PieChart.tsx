import { useEffect, useRef } from "react";

interface DataPoint {
  label: string;
  value: number;
  color?: string;
}

interface PieChartProps {
  data: DataPoint[];
  title: string;
  height?: number;
}

export default function PieChart({ data, title, height = 300 }: PieChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const colors = [
    "#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6",
    "#ec4899", "#6366f1", "#14b8a6", "#f97316", "#8b5cf6"
  ];

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 清除画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 设置画布尺寸
    canvas.width = canvas.offsetWidth;
    canvas.height = height;
    
    // 计算总和
    const total = data.reduce((sum, item) => sum + item.value, 0);
    
    // 绘制饼图
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 40;
    
    let startAngle = 0;
    
    data.forEach((item, index) => {
      const sliceAngle = (item.value / total) * 2 * Math.PI;
      const endAngle = startAngle + sliceAngle;
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      
      ctx.fillStyle = item.color || colors[index % colors.length];
      ctx.fill();
      
      // 绘制标签线
      const midAngle = startAngle + sliceAngle / 2;
      const labelRadius = radius * 1.2;
      const labelX = centerX + Math.cos(midAngle) * labelRadius;
      const labelY = centerY + Math.sin(midAngle) * labelRadius;
      
      ctx.beginPath();
      ctx.moveTo(centerX + Math.cos(midAngle) * radius, centerY + Math.sin(midAngle) * radius);
      ctx.lineTo(labelX, labelY);
      ctx.strokeStyle = "#9ca3af";
      ctx.stroke();
      
      // 绘制标签
      ctx.fillStyle = "#6b7280";
      ctx.font = "12px sans-serif";
      ctx.textAlign = midAngle < Math.PI ? "left" : "right";
      ctx.textBaseline = "middle";
      ctx.fillText(`${item.label} (${Math.round(item.value / total * 100)}%)`, labelX, labelY);
      
      startAngle = endAngle;
    });
    
  }, [data, height, colors]);

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">{title}</h3>
      <canvas ref={canvasRef} className="w-full" height={height}></canvas>
    </div>
  );
}