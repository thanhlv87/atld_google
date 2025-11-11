import React from 'react';

interface InfoItem {
    text: string;
    details?: string;
}

interface InfoPanelProps {
    icon: string;
    title: string;
    items: InfoItem[];
    theme?: 'primary' | 'danger';
}

const InfoPanel: React.FC<InfoPanelProps> = ({ icon, title, items, theme = 'primary' }) => {
    const themeClasses = {
        primary: {
            iconBg: 'bg-primary/10',
            iconText: 'text-primary',
            titleText: 'text-neutral-dark',
        },
        danger: {
            iconBg: 'bg-red-100',
            iconText: 'text-red-600',
            titleText: 'text-red-800',
        },
    };
    
    const currentTheme = themeClasses[theme];

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-md h-full">
            <div className="flex items-center mb-4">
                <div className={`flex-shrink-0 h-10 w-10 flex items-center justify-center ${currentTheme.iconBg} rounded-full mr-3`}>
                    <i className={`fas ${icon} ${currentTheme.iconText}`}></i>
                </div>
                <h3 className={`text-lg font-bold ${currentTheme.titleText}`}>{title}</h3>
            </div>
            {items.length > 0 ? (
                <ul className="space-y-3">
                    {items.map((item, index) => (
                        <li key={index} className="flex justify-between items-center text-sm">
                            <span className="text-gray-700">{item.text}</span>
                            {item.details && <span className="font-bold text-neutral-dark bg-gray-100 px-2 py-0.5 rounded-md">{item.details}</span>}
                        </li>
                    ))}
                </ul>
            ) : (
                 <p className="text-sm text-center text-gray-500 py-4">Không có dữ liệu.</p>
            )}
        </div>
    );
};

export default InfoPanel;
