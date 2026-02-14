import React from 'react';

const BenefitCard: React.FC<{
    icon: string;
    title: string;
    description: string;
    gradient: string;
}> = ({ icon, title, description, gradient }) => (
    <div className="relative bg-white rounded-2xl shadow-lg p-8 border border-gray-100 text-center transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl h-full group overflow-hidden">
        <div
            className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}
        ></div>
        <div
            className={`relative flex items-center justify-center h-20 w-20 rounded-2xl bg-gradient-to-br ${gradient} mx-auto mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`}
        >
            <i className={`fas ${icon} text-4xl text-white`}></i>
        </div>
        <h3 className="font-bold text-neutral-dark mb-3 text-xl group-hover:text-primary transition-colors">
            {title}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-orange-500/5 rounded-full blur-3xl transform translate-x-16 translate-y-16 group-hover:scale-150 transition-transform duration-500"></div>
    </div>
);

const BenefitsSection: React.FC = () => {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <div className="inline-block bg-gradient-to-r from-primary to-orange-600 text-white px-4 py-1 rounded-full text-sm font-semibold mb-4">
                        LỢI ÍCH
                    </div>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-neutral-dark mb-4">
                        Tại sao chọn SafetyConnect?
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Giải pháp toàn diện cho nhu cầu đào tạo an toàn lao động của doanh nghiệp
                    </p>
                </div>
                <div className="grid md:grid-cols-3 gap-10">
                    <BenefitCard
                        icon="fa-rocket"
                        title="Kết nối nhanh chóng"
                        description="Tiếp cận hàng chục đối tác đào tạo uy tín chỉ với một yêu cầu duy nhất, tiết kiệm thời gian tìm kiếm."
                        gradient="from-blue-500 to-blue-700"
                    />
                    <BenefitCard
                        icon="fa-piggy-bank"
                        title="Hoàn toàn miễn phí"
                        description="Nền tảng miễn phí cho các doanh nghiệp có nhu cầu đào tạo, giúp tối ưu hóa chi phí."
                        gradient="from-green-500 to-green-700"
                    />
                    <BenefitCard
                        icon="fa-star"
                        title="Chất lượng đảm bảo"
                        description="Tất cả đối tác đào tạo đều được xác minh năng lực và kinh nghiệm trước khi tham gia nền tảng."
                        gradient="from-purple-500 to-purple-700"
                    />
                </div>
            </div>
        </section>
    );
};

export default BenefitsSection;
