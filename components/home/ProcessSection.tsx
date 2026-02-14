import React from 'react';

const ProcessStep: React.FC<{
    number: string;
    title: string;
    description: string;
    gradient: string;
}> = ({ number, title, description, gradient }) => (
    <div className="relative bg-white rounded-2xl shadow-lg p-8 border border-gray-100 text-center h-full hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group">
        <div
            className={`flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br ${gradient} text-white font-bold text-2xl mx-auto mb-6 shadow-md group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}
        >
            {number}
        </div>
        <h3 className="text-xl font-bold text-neutral-dark mb-3 group-hover:text-primary transition-colors">
            {title}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
        <div
            className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}
        ></div>
    </div>
);

const ProcessSection: React.FC = () => {
    return (
        <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <div className="inline-block bg-gradient-to-r from-primary to-orange-600 text-white px-4 py-1 rounded-full text-sm font-semibold mb-4">
                        QUY TRÌNH
                    </div>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-neutral-dark mb-4">
                        Quy trình hoạt động
                    </h2>
                    <p className="text-gray-600 text-lg">
                        Minh bạch, rõ ràng cho cả Doanh nghiệp và Đối tác.
                    </p>
                </div>

                <div className="mb-20">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-3 rounded-2xl shadow-lg">
                            <i className="fas fa-building text-2xl"></i>
                            <h3 className="text-2xl font-bold">Dành cho Doanh nghiệp</h3>
                        </div>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        <ProcessStep
                            number="1"
                            title="Gửi yêu cầu"
                            description="Điền form nhu cầu đào tạo chi tiết của doanh nghiệp."
                            gradient="from-blue-500 to-blue-700"
                        />
                        <ProcessStep
                            number="2"
                            title="Nhận báo giá"
                            description="Các đối tác uy tín gửi báo giá và chương trình phù hợp."
                            gradient="from-blue-500 to-blue-700"
                        />
                        <ProcessStep
                            number="3"
                            title="So sánh & chọn"
                            description="Lựa chọn đối tác có báo giá và năng lực phù hợp nhất."
                            gradient="from-blue-500 to-blue-700"
                        />
                        <ProcessStep
                            number="4"
                            title="Ký hợp đồng"
                            description="Ký kết và triển khai chương trình đào tạo hiệu quả."
                            gradient="from-blue-500 to-blue-700"
                        />
                    </div>
                </div>

                <div>
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-green-700 text-white px-6 py-3 rounded-2xl shadow-lg">
                            <i className="fas fa-chalkboard-teacher text-2xl"></i>
                            <h3 className="text-2xl font-bold">Dành cho Đối tác Đào tạo</h3>
                        </div>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        <ProcessStep
                            number="1"
                            title="Đăng ký"
                            description="Tạo tài khoản và trở thành đối tác của nền tảng."
                            gradient="from-green-500 to-green-700"
                        />
                        <ProcessStep
                            number="2"
                            title="Nhận thông báo"
                            description="Nhận thông báo về các yêu cầu đào tạo phù hợp."
                            gradient="from-green-500 to-green-700"
                        />
                        <ProcessStep
                            number="3"
                            title="Gửi báo giá"
                            description="Gửi chương trình và báo giá chi tiết cho khách hàng."
                            gradient="from-green-500 to-green-700"
                        />
                        <ProcessStep
                            number="4"
                            title="Triển khai"
                            description="Thực hiện đào tạo chuyên nghiệp và nhận thanh toán."
                            gradient="from-green-500 to-green-700"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProcessSection;
