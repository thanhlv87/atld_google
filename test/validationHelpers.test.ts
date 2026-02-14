import { describe, it, expect } from 'vitest';
import { isValidEmail, isValidPhone, isValidTaxId } from '../utils/validationHelpers';

describe('validationHelpers', () => {
    describe('isValidEmail', () => {
        it('returns true for valid emails', () => {
            expect(isValidEmail('test@example.com')).toBe(true);
            expect(isValidEmail('user.name@company.co.vn')).toBe(true);
        });

        it('returns false for invalid emails', () => {
            expect(isValidEmail('invalid')).toBe(false);
            expect(isValidEmail('test@')).toBe(false);
            expect(isValidEmail('@example.com')).toBe(false);
            expect(isValidEmail('test@example')).toBe(false);
        });
    });

    describe('isValidPhone', () => {
        it('returns true for valid Vietnamese phone numbers', () => {
            expect(isValidPhone('0912345678')).toBe(true);
            expect(isValidPhone('0381234567')).toBe(true);
        });

        it('returns false for invalid phone numbers', () => {
            expect(isValidPhone('123')).toBe(false);
            expect(isValidPhone('091234567')).toBe(false); // Too short
            expect(isValidPhone('091234567890')).toBe(false); // Too long
            expect(isValidPhone('abcdefghij')).toBe(false);
        });
    });

    describe('isValidTaxId', () => {
        it('returns true for valid 10-digit tax IDs', () => {
            expect(isValidTaxId('0123456789')).toBe(true);
        });

        it('returns true for valid 13-digit tax IDs (with hyphen)', () => {
            expect(isValidTaxId('0123456789-001')).toBe(true);
        });

        it('returns false for invalid tax IDs', () => {
            expect(isValidTaxId('123')).toBe(false);
            expect(isValidTaxId('abcdefghij')).toBe(false);
        });
    });
});
