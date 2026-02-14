import React from 'react';
import SitemapGenerator from '../SitemapGenerator';

const SeoTab: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
                <SitemapGenerator />
            </div>
        </div>
    );
};

export default SeoTab;
