import React from 'react';

interface KPIStatCardProps {
    icon: string;
    title: string;
    value: string;
    details: string;
}

const KPIStatCard: React.FC<KPIStatCardProps> = ({ icon, title, value, details }) => {
    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300 flex items-center space-x-4">
            <div className="flex-shrink-0 h-14 w-14 flex items-center justify-center bg-primary/10 rounded-full">
                <i className={`fas ${icon} text-2xl text-primary`}></i>
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-3xl font-bold text-neutral-dark">{value}</p>
                <p className="text-xs text-gray-400 mt-1">{details}</p>
            </div>
        </div>
    );
};

export default KPIStatCard;
