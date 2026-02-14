import React from 'react';
import TrainingRequestForm from '../TrainingRequestForm';

const CTAFormSection: React.FC = () => {
    return (
        <section
            id="create-request-form"
            className="relative py-20 bg-gradient-to-br from-white via-blue-50 to-white overflow-hidden"
        >
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
            </div>

            <div className="relative container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-12">
                    <div className="inline-block bg-gradient-to-r from-primary to-orange-600 text-white px-4 py-1 rounded-full text-sm font-semibold mb-4">
                        BẮT ĐẦU NGAY
                    </div>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-neutral-dark mb-4">
                        Tạo yêu cầu đào tạo
                    </h2>
                    <p className="text-gray-600 text-lg">
                        Nhận báo giá từ nhiều đối tác uy tín trong vòng 24h
                    </p>
                </div>

                <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100">
                    <TrainingRequestForm />
                </div>
            </div>
        </section>
    );
};

export default CTAFormSection;
