/**
 * Validation and formatting utilities for partner information
 */

/**
 * Validates and formats a URL to ensure it's safe and properly formatted
 * @param url - The URL to validate
 * @returns Formatted URL or empty string if invalid
 */
export const validateAndFormatUrl = (url: string | undefined): string => {
  if (!url || url.trim() === '') return '';

  const trimmedUrl = url.trim();

  // Check if URL already has protocol
  if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
    try {
      new URL(trimmedUrl);
      return trimmedUrl;
    } catch {
      return '';
    }
  }

  // Add https:// if no protocol
  try {
    const formattedUrl = `https://${trimmedUrl}`;
    new URL(formattedUrl);
    return formattedUrl;
  } catch {
    return '';
  }
};

/**
 * Formats a phone number for tel: protocol
 * Removes spaces, dashes, and parentheses
 * @param phone - The phone number to format
 * @returns Formatted phone number
 */
export const formatPhoneForTel = (phone: string | undefined): string => {
  if (!phone) return '';

  // Remove all non-digit characters except +
  return phone.replace(/[^\d+]/g, '');
};

/**
 * Formats a phone number for display
 * @param phone - The phone number to format
 * @returns Formatted phone number for display
 */
export const formatPhoneForDisplay = (phone: string | undefined): string => {
  if (!phone) return '';

  const cleaned = phone.replace(/\D/g, '');

  // Vietnamese phone number format
  if (cleaned.startsWith('84')) {
    // International format: +84 xxx xxx xxx
    const match = cleaned.match(/^84(\d{2,3})(\d{3})(\d{3,4})$/);
    if (match) {
      return `+84 ${match[1]} ${match[2]} ${match[3]}`;
    }
  } else if (cleaned.startsWith('0')) {
    // Local format: 0xxx xxx xxx
    const match = cleaned.match(/^0(\d{2,3})(\d{3})(\d{3,4})$/);
    if (match) {
      return `0${match[1]} ${match[2]} ${match[3]}`;
    }
  }

  return phone; // Return original if no format matches
};

/**
 * Sanitizes text to prevent XSS attacks
 * @param text - The text to sanitize
 * @returns Sanitized text
 */
export const sanitizeText = (text: string | undefined): string => {
  if (!text) return '';

  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Gets a professional business name from partner data
 * @param businessName - The business name
 * @param email - The email address
 * @returns Professional business name
 */
export const getBusinessName = (businessName: string | undefined, email: string): string => {
  if (businessName && businessName.trim() !== '') {
    return businessName.trim();
  }

  // Extract from email but make it more professional
  const emailPrefix = email.split('@')[0];

  // Capitalize first letter of each word
  return emailPrefix
    .split(/[-_.]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Gets a professional description with fallback
 * @param description - The description
 * @param specializations - Array of specializations
 * @returns Professional description
 */
export const getDescription = (
  description: string | undefined,
  specializations: string[]
): string => {
  if (description && description.trim() !== '') {
    return description.trim();
  }

  // Create a more specific fallback based on specializations
  if (specializations && specializations.length > 0) {
    const mainSpec = specializations[0];
    return `Đơn vị đào tạo chuyên về ${mainSpec} và các lĩnh vực an toàn lao động khác`;
  }

  return 'Đơn vị đào tạo an toàn lao động uy tín';
};

/**
 * Checks if a URL is valid
 * @param url - The URL to check
 * @returns True if valid, false otherwise
 */
export const isValidUrl = (url: string | undefined): boolean => {
  if (!url) return false;

  try {
    const formatted = validateAndFormatUrl(url);
    return formatted !== '';
  } catch {
    return false;
  }
};

/**
 * Validates an email address
 * @param email - The email to validate
 * @returns True if valid
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates a Vietnamese phone number
 * @param phone - The phone number to validate
 * @returns True if valid
 */
export const isValidPhone = (phone: string): boolean => {
  // Vietnamese phone numbers: 10 digits starting with 0, or legacy 11 digits
  // Strict check: starts with 03, 05, 07, 08, 09, length 10
  const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
  return phoneRegex.test(phone);
};

/**
 * Validates a Tax ID (Mã số thuế)
 * @param taxId - The tax ID to validate
 * @returns True if valid
 */
export const isValidTaxId = (taxId: string): boolean => {
  // Simple regex for 10 or 13 digits (with optional hyphen)
  const taxIdRegex = /^[0-9]{10}(-[0-9]{3})?$/;
  return taxIdRegex.test(taxId);
};
