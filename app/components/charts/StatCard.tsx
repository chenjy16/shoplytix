interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  change?: {
    value: number;
    isPositive: boolean;
  };
}

export default function StatCard({ title, value, icon, change }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
      <div className="flex justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">{value}</p>
          {change && (
            <div className="flex items-center mt-2">
              <span
                className={`text-sm font-medium ${
                  change.isPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                {change.isPositive ? "+" : "-"}{Math.abs(change.value)}%
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">vs 上月</span>
            </div>
          )}
        </div>
        <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-xl text-blue-600 dark:text-blue-300">
          {icon}
        </div>
      </div>
    </div>
  );
}