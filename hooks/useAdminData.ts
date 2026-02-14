import { useState, useEffect } from 'react';
import {
    db,
    collection,
    query,
    orderBy,
    onSnapshot,
    Timestamp,
} from '../services/firebaseConfig';
import { PartnerProfile, TrainingRequest } from '../types';

export const useAdminData = () => {
    const [partners, setPartners] = useState<PartnerProfile[]>([]);
    const [requests, setRequests] = useState<TrainingRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState('');

    useEffect(() => {
        setLoadError('');
        setLoading(true);

        const partnersCollection = collection(db, 'partners');
        const partnersQuery = query(partnersCollection, orderBy('createdAt', 'desc'));
        const partnersUnsubscribe = onSnapshot(
            partnersQuery,
            (querySnapshot) => {
                const partnersData = querySnapshot.docs.map(
                    (docSnap) =>
                        ({
                            uid: docSnap.id,
                            ...docSnap.data(),
                            // Ensure createdAt is a Firestore Timestamp
                            createdAt: docSnap.data().createdAt || Timestamp.now(),
                        }) as PartnerProfile
                );
                setPartners(partnersData);
                setLoading(false);
            },
            (err) => {
                console.error('Error fetching partners: ', err);
                setLoadError((prev) => `${prev}\nKhông thể tải danh sách đối tác: ${err.message}`);
                setLoading(false);
            }
        );

        const requestsCollection = collection(db, 'trainingRequests');
        const requestsQuery = query(requestsCollection, orderBy('createdAt', 'desc'));
        const requestsUnsubscribe = onSnapshot(
            requestsQuery,
            (querySnapshot) => {
                const requestsData = querySnapshot.docs.map(
                    (docSnap) => ({ id: docSnap.id, ...docSnap.data() }) as TrainingRequest
                );
                setRequests(requestsData);
            },
            (err) => {
                console.error('Error fetching requests: ', err);
                setLoadError((prev) => `${prev}\nKhông thể tải danh sách yêu cầu: ${err.message}`);
            }
        );

        return () => {
            partnersUnsubscribe();
            requestsUnsubscribe();
        };
    }, []);

    return { partners, requests, loading, loadError };
};
