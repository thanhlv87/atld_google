import React from 'react';

const StatCard: React.FC<{ value: string; label: string; icon: string; gradient: string }> = ({
    value,
    label,
    icon,
    gradient,
}) => (
    <div
        className={`relative overflow-hidden bg-gradient-to-br ${gradient} rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group`}
    >
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
        <div className="relative z-10">
            <div className="flex items-center justify-center mb-4">
                <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm">
                    <i className={`fas ${icon} text-3xl text-white`}></i>
                </div>
            </div>
            <p className="text-4xl md:text-5xl font-extrabold text-white mb-2">{value}</p>
            <p className="text-sm md:text-base text-white/90 font-medium">{label}</p>
        </div>
    </div>
);

const StatsSection: React.FC = () => {
    return (
        <section className="py-20 bg-gradient-to-b from-white via-gray-50 to-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-neutral-dark mb-3">
                        Con số ấn tượng
                    </h2>
                    <p className="text-gray-600">Những thành tựu đã đạt được</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    <StatCard
                        value="50+"
                        label="Đối tác đào tạo"
                        icon="fa-handshake"
                        gradient="from-blue-500 to-blue-700"
                    />
                    <StatCard
                        value="200+"
                        label="Doanh nghiệp tin dùng"
                        icon="fa-building"
                        gradient="from-green-500 to-green-700"
                    />
                    <StatCard
                        value="1000+"
                        label="Học viên đã đào tạo"
                        icon="fa-user-graduate"
                        gradient="from-purple-500 to-purple-700"
                    />
                    <StatCard
                        value="98%"
                        label="Mức độ hài lòng"
                        icon="fa-star"
                        gradient="from-orange-500 to-orange-700"
                    />
                </div>
            </div>
        </section>
    );
};

export default StatsSection;
