import { describe, it, expect } from 'vitest';
import { groupMessagesByDate, formatMessageTime } from '../utils/chatHelpers';
import { ChatMessage } from '../types';
import { Timestamp } from 'firebase/firestore';

// Mock Firestore Timestamp
const createMockTimestamp = (seconds: number) => ({
    seconds,
    nanoseconds: 0,
    toDate: () => new Date(seconds * 1000),
    toMillis: () => seconds * 1000,
    isEqual: () => false,
    valueOf: () => '',
    toJSON: () => ({ seconds, nanoseconds: 0 }),
} as unknown as Timestamp);

describe('chatHelpers', () => {
    describe('formatMessageTime', () => {
        it('formats timestamp correctly', () => {
            const date = new Date('2023-01-01T10:30:00');
            const timestamp = createMockTimestamp(date.getTime() / 1000);
            const formatted = formatMessageTime(timestamp);
            // Validating time format (hh:mm p) - output depends on locale but usually matches strict pattern
            expect(formatted).toMatch(/\d{1,2}:\d{2}\s?(AM|PM|SA|CH)?/);
        });
    });

    describe('groupMessagesByDate', () => {
        it('groups messages by date correctly', () => {
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);

            const messages: ChatMessage[] = [
                {
                    id: '1',
                    roomId: 'room1',
                    message: 'Message 1',
                    senderId: 'user1',
                    senderName: 'User 1',
                    senderRole: 'client',
                    read: false,
                    createdAt: createMockTimestamp(today.getTime() / 1000),
                },
                {
                    id: '2',
                    roomId: 'room1',
                    message: 'Message 2',
                    senderId: 'user2',
                    senderName: 'User 2',
                    senderRole: 'partner',
                    read: false,
                    createdAt: createMockTimestamp(today.getTime() / 1000 + 60), // 1 min later
                },
                {
                    id: '3',
                    roomId: 'room1',
                    message: 'Message 3',
                    senderId: 'user1',
                    senderName: 'User 1',
                    senderRole: 'client',
                    read: true,
                    createdAt: createMockTimestamp(yesterday.getTime() / 1000),
                }
            ];

            const groups = groupMessagesByDate(messages);

            expect(Object.keys(groups)).toHaveLength(2); // Today and Yesterday

            // Check if messages are sorted within groups (implementation dependent, but usually insertion order)
            const todayKey = Object.keys(groups).find(k => k.includes(today.toLocaleDateString('vi-VN')));
            // Note: toLocaleDateString might vary by environment settings (node vs browser), 
            // but assuming consistent vi-VN locale from helper

            if (todayKey) {
                expect(groups[todayKey]).toHaveLength(2);
                expect(groups[todayKey].find(m => m.id === '1')).toBeDefined();
                expect(groups[todayKey].find(m => m.id === '2')).toBeDefined();
            }
        });
    });
});
