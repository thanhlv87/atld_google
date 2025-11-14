import { useState, useEffect } from 'react';
import {
  db,
  collection,
  query,
  where,
  onSnapshot,
  type User
} from '../services/firebaseConfig';

/**
 * Hook to count unread messages for the current user
 * @param user - Current authenticated user
 * @param isAdmin - Whether user is admin
 * @param partnerStatus - Partner approval status
 * @returns Number of unread messages
 */
export const useUnreadMessages = (
  user: User | null,
  isAdmin: boolean,
  partnerStatus: 'pending' | 'approved' | 'rejected' | null
): number => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) {
      setUnreadCount(0);
      return;
    }

    // Determine user role
    let userRole: 'admin' | 'partner' | 'client';
    if (isAdmin) {
      userRole = 'admin';
    } else if (partnerStatus === 'approved') {
      userRole = 'partner';
    } else {
      userRole = 'client';
    }

    // Query chat rooms based on role
    const roomsCollection = collection(db, 'chatRooms');
    let q;

    if (userRole === 'admin') {
      // Admin sees all rooms, count unread from client side
      q = query(roomsCollection);
    } else if (userRole === 'partner') {
      // Partners see rooms where they are the partner
      q = query(
        roomsCollection,
        where('partnerId', '==', user.uid)
      );
    } else {
      // Clients see rooms where they are the client
      q = query(
        roomsCollection,
        where('clientId', '==', user.uid)
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let totalUnread = 0;

      snapshot.docs.forEach((doc) => {
        const roomData = doc.data();

        // Count unread based on role
        if (userRole === 'admin' || userRole === 'client') {
          // For admin and client, count unreadCount.client
          totalUnread += roomData.unreadCount?.client || 0;
        } else if (userRole === 'partner') {
          // For partner, count unreadCount.partner
          totalUnread += roomData.unreadCount?.partner || 0;
        }
      });

      setUnreadCount(totalUnread);
    });

    return () => unsubscribe();
  }, [user, isAdmin, partnerStatus]);

  return unreadCount;
};
