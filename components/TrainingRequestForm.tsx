import React, { useState } from 'react';
import { db, firebase, sendEmail } from '../services/firebaseConfig';
import { TRAINING_TYPES, TRAINING_GROUPS } from '../types';
import { generatePartnerNotificationEmail } from '../utils/emailTemplates';

const TrainingRequestForm: React.FC = () => {
  const initialDetailState = { type: TRAINING_TYPES[0], group: TRAINING_GROUPS[0], participants: '', customType: '' };
  const initialFormState = {
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    trainingDuration: '',
    preferredTime: '',
    description: '',
    location: '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [trainingDetails, setTrainingDetails] = useState([initialDetailState]);
  const [isUrgent, setIsUrgent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDetailChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const updatedDetails = [...trainingDetails];
    updatedDetails[index] = { ...updatedDetails[index], [name]: value };
    setTrainingDetails(updatedDetails);
  };

  const addDetail = () => {
    setTrainingDetails([...trainingDetails, { ...initialDetailState }]);
  };

  const removeDetail = (index: number) => {
    const updatedDetails = trainingDetails.filter((_, i) => i !== index);
    setTrainingDetails(updatedDetails);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.clientName || !formData.clientEmail || !formData.clientPhone || !formData.description || !formData.location || !formData.trainingDuration || !formData.preferredTime) {
      setError('Vui lòng điền đầy đủ các trường thông tin chung.');
      return;
    }

    const processedDetails = [];
    for (const detail of trainingDetails) {
      const finalType = detail.type.startsWith('Khác') ? detail.customType : detail.type;
      if (!finalType.trim() || !detail.participants) {
        setError('Vui lòng điền đầy đủ loại hình và số lượng cho tất cả các nội dung huấn luyện.');
        return;
      }
      const participantsNum = parseInt(detail.participants);
      if (isNaN(participantsNum) || participantsNum <= 0) {
        setError('Số lượng học viên phải là một số dương.');
        return;
      }
      processedDetails.push({ type: finalType, group: detail.group, participants: participantsNum });
    }

    setSubmitting(true);
    try {
      const requestRef = await db.collection('trainingRequests').add({
        ...formData,
        trainingDetails: processedDetails,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        viewedBy: [],
        urgent: isUrgent,
      });

      // Gửi email thông báo cho các đối tác phù hợp
      let emailNotificationMessage = '';
      try {
        // Lấy danh sách đối tác có năng lực phù hợp
        const trainingTypes = processedDetails.map(detail => detail.type);
        console.log('🔍 Tìm đối tác phù hợp cho các loại đào tạo:', trainingTypes);

        const partnersQuery = await db.collection('partners')
          .where('status', '==', 'approved')
          .where('subscribesToEmails', '==', true)
          .get();

        console.log('📊 Tìm thấy', partnersQuery.size, 'đối tác đã approved và đăng ký nhận email');

        const matchingPartners = [];
        partnersQuery.forEach(doc => {
          const partner = doc.data();
          // Kiểm tra xem đối tác có năng lực phù hợp với bất kỳ loại đào tạo nào trong yêu cầu không
          const hasMatchingCapability = partner.capabilities && partner.capabilities.some(capability =>
            trainingTypes.includes(capability)
          );
          if (hasMatchingCapability) {
            matchingPartners.push(partner);
            console.log('✅ Đối tác phù hợp:', partner.email, '- Capabilities:', partner.capabilities);
          }
        });

        console.log('📧 Số lượng đối tác phù hợp sẽ nhận email:', matchingPartners.length);

        // Gửi email thông báo cho các đối tác phù hợp
        if (matchingPartners.length > 0) {
          const partnerEmails = matchingPartners.map(partner => partner.email);
          const trainingTypesText = trainingTypes.join(', ');

          console.log('📬 Đang queue email cho:', partnerEmails);

          // Generate beautiful HTML email template
          const emailHtml = generatePartnerNotificationEmail(
            processedDetails,
            {
              clientName: formData.clientName,
              clientEmail: formData.clientEmail,
              clientPhone: formData.clientPhone,
              location: formData.location,
              description: formData.description,
              trainingDuration: formData.trainingDuration,
              preferredTime: formData.preferredTime,
            },
            isUrgent
          );

          const emailId = await sendEmail(
            partnerEmails,
            `🎯 Yêu cầu đào tạo mới: ${trainingTypesText}`,
            emailHtml
          );

          console.log('✅ Email đã được queue thành công với ID:', emailId);
          emailNotificationMessage = ` Đã gửi thông báo đến ${matchingPartners.length} đơn vị đào tạo phù hợp.`;
        } else {
          console.log('⚠️ Không tìm thấy đối tác phù hợp với yêu cầu này');
          emailNotificationMessage = ' Lưu ý: Hiện chưa có đơn vị đào tạo nào phù hợp trong hệ thống, nhưng yêu cầu của bạn đã được lưu lại.';
        }
      } catch (emailErr) {
        console.error("❌ Error sending notification emails: ", emailErr);
        console.error("Error details:", emailErr);
        // Không throw lỗi này để không ảnh hưởng đến việc tạo yêu cầu
        emailNotificationMessage = ' (Lưu ý: Có lỗi khi gửi email thông báo, nhưng yêu cầu của bạn đã được lưu thành công)';
      }

      setSuccess('Yêu cầu của bạn đã được gửi thành công!' + emailNotificationMessage + ' Các đơn vị đào tạo sẽ sớm liên hệ với bạn.');
      setFormData(initialFormState);
      setTrainingDetails([initialDetailState]);
      setIsUrgent(false);
    } catch (err) {
      console.error("Error adding document: ", err);
      setError('Đã xảy ra lỗi khi gửi yêu cầu. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };
  
  const inputClasses = "w-full p-3 border border-gray-300 rounded-lg bg-white text-neutral-dark focus:ring-2 focus:ring-primary placeholder-gray-500";


  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200">
      <h3 className="text-2xl md:text-3xl font-bold text-neutral-dark mb-4 text-center">Tạo Yêu Cầu Đào Tạo Miễn Phí</h3>
      <p className="text-gray-600 mb-6 text-sm text-center">Thông tin liên hệ của bạn sẽ được bảo mật và chỉ hiển thị cho các đơn vị đào tạo sau khi họ đăng nhập.</p>
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mb-4" role="alert">
          <span className="block sm:inline">{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact Info */}
        <div className="space-y-4">
            <h4 className="font-semibold text-neutral-dark border-b pb-2">Thông tin người liên hệ</h4>
            <input type="text" name="clientName" placeholder="Tên người liên hệ (*)" value={formData.clientName} onChange={handleChange} className={inputClasses} required />
            <input type="email" name="clientEmail" placeholder="Email (*)" value={formData.clientEmail} onChange={handleChange} className={inputClasses} required />
            <input type="tel" name="clientPhone" placeholder="Số điện thoại (*)" value={formData.clientPhone} onChange={handleChange} className={inputClasses} required />
        </div>

        {/* Training Details */}
        <div className="space-y-4">
            <h4 className="font-semibold text-neutral-dark border-b pb-2">Nội dung huấn luyện</h4>
            {trainingDetails.map((detail, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3 bg-gray-50 relative">
                    {trainingDetails.length > 1 && (
                        <button type="button" onClick={() => removeDetail(index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">
                            <i className="fas fa-times-circle"></i>
                        </button>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <select name="type" value={detail.type} onChange={e => handleDetailChange(index, e)} className={inputClasses} required>
                            {TRAINING_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                        </select>
                         {detail.type.startsWith('Khác') && (
                            <input type="text" name="customType" placeholder="Nội dung đào tạo (*)" value={detail.customType} onChange={e => handleDetailChange(index, e)} className={inputClasses} required />
                         )}
                        <select name="group" value={detail.group} onChange={e => handleDetailChange(index, e)} className={inputClasses}>
                            {TRAINING_GROUPS.map(group => <option key={group} value={group}>{group}</option>)}
                        </select>
                    </div>
                    <input type="number" name="participants" placeholder="Số lượng học viên (*)" value={detail.participants} onChange={e => handleDetailChange(index, e)} className={inputClasses} required min="1" />
                </div>
            ))}
            <button type="button" onClick={addDetail} className="text-sm font-semibold text-primary hover:text-primary-dark transition-colors">
                <i className="fas fa-plus mr-2"></i>Thêm nội dung huấn luyện
            </button>
        </div>

        {/* General Info */}
        <div className="space-y-4">
             <h4 className="font-semibold text-neutral-dark border-b pb-2">Thông tin chung</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="trainingDuration" placeholder="Thời gian huấn luyện (VD: 2 ngày) (*)" value={formData.trainingDuration} onChange={handleChange} className={inputClasses} required />
              <input type="text" name="preferredTime" placeholder="Thời điểm huấn luyện (VD: T11/2024) (*)" value={formData.preferredTime} onChange={handleChange} className={inputClasses} required />
            </div>
            <input type="text" name="location" placeholder="Địa điểm huấn luyện (*)" value={formData.location} onChange={handleChange} className={inputClasses} required />
            <textarea name="description" placeholder="Mô tả chi tiết yêu cầu khác (ví dụ: yêu cầu về giảng viên, chứng chỉ...)" value={formData.description} onChange={handleChange} rows={4} className={inputClasses} required />
        </div>
        
        {/* Urgent Request Checkbox */}
        <div className="mt-4 p-4 border border-yellow-300 bg-yellow-50 rounded-lg">
            <label className="flex items-center space-x-3 cursor-pointer">
                <input
                    type="checkbox"
                    checked={isUrgent}
                    onChange={(e) => setIsUrgent(e.target.checked)}
                    className="h-5 w-5 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <span className="font-semibold text-neutral-dark">
                    Yêu cầu báo giá khẩn cấp
                    <span className="font-normal text-sm block text-gray-600">Đánh dấu nếu bạn cần triển khai huấn luyện trong vòng 7 ngày. Yêu cầu của bạn sẽ được ưu tiên hiển thị.</span>
                </span>
            </label>
        </div>

        
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        
        <button type="submit" disabled={submitting} className="w-full flex justify-center items-center bg-primary text-white font-bold py-3 rounded-lg hover:opacity-90 transition duration-300 disabled:bg-primary-dark disabled:opacity-75 disabled:cursor-wait">
          {submitting ? (
              <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Đang gửi...</span>
              </>
          ) : 'Gửi Yêu Cầu Ngay'}
        </button>
      </form>
    </div>
  );
};

export default TrainingRequestForm;