import { useEffect, useRef } from "react";

interface DataPoint {
  label: string;
  value: number;
}

interface BarChartProps {
  data: DataPoint[];
  title: string;
  height?: number;
  color?: string;
}

export default function BarChart({ data, title, height = 300, color = "#3b82f6" }: BarChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
    
    // 绘制图表
    const padding = 40;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;
    
    // 找出最大值
    const maxValue = Math.max(...data.map(d => d.value)) * 1.1;
    
    // 绘制坐标轴
    ctx.beginPath();
    ctx.strokeStyle = "#e5e7eb";
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();
    
    // 绘制柱状图
    const barWidth = chartWidth / data.length * 0.8;
    const barSpacing = chartWidth / data.length * 0.2;
    
    data.forEach((point, index) => {
      const barHeight = (point.value / maxValue) * chartHeight;
      const x = padding + index * (barWidth + barSpacing);
      const y = canvas.height - padding - barHeight;
      
      ctx.fillStyle = color;
      ctx.fillRect(x, y, barWidth, barHeight);
      
      // 绘制数值
      ctx.fillStyle = "#6b7280";
      ctx.font = "12px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(point.value.toString(), x + barWidth / 2, y - 5);
      
      // 绘制标签
      ctx.fillText(point.label, x + barWidth / 2, canvas.height - padding + 15);
    });
    
  }, [data, height, color]);

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">{title}</h3>
      <canvas ref={canvasRef} className="w-full" height={height}></canvas>
    </div>
  );
}