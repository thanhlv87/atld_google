import React from 'react';

interface GrowthChartProps {
    title: string;
}

// Đây là một component placeholder. Trong một ứng dụng thực tế, bạn sẽ
// sử dụng một thư viện biểu đồ như Chart.js, Recharts, hoặc ApexCharts.
const GrowthChart: React.FC<GrowthChartProps> = ({ title }) => {
    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-md h-full">
            <h3 className="text-lg font-bold text-neutral-dark mb-4">{title}</h3>
            <div className="h-56 flex items-end justify-around bg-gray-50 rounded-lg p-4 space-x-2">
                {/* Placeholder bars for the chart */}
                <div className="w-1/6 bg-blue-200 rounded-t-lg" style={{ height: '40%' }}></div>
                <div className="w-1/6 bg-primary/30 rounded-t-lg" style={{ height: '60%' }}></div>
                <div className="w-1/6 bg-blue-200 rounded-t-lg" style={{ height: '50%' }}></div>
                <div className="w-1/6 bg-primary/30 rounded-t-lg" style={{ height: '75%' }}></div>
                <div className="w-1/6 bg-blue-200 rounded-t-lg" style={{ height: '65%' }}></div>
                <div className="w-1/6 bg-primary/30 rounded-t-lg" style={{ height: '85%' }}></div>
            </div>
            <div className="flex justify-center space-x-6 mt-4 text-sm text-gray-500">
                <div className="flex items-center">
                    <span className="h-3 w-3 rounded-full bg-primary/30 mr-2"></span>
                    <span>Yêu cầu</span>
                </div>
                <div className="flex items-center">
                    <span className="h-3 w-3 rounded-full bg-blue-200 mr-2"></span>
                    <span>Đối tác</span>
                </div>
            </div>
        </div>
    );
};

export default GrowthChart;