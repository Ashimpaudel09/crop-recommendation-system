"use client";

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';

export function useExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchExpenses = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/expense');
      setExpenses(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch expenses');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const addExpense = async (data) => {
    // Clean up empty strings to null for optional fields
    const payload = { ...data };
    if (!payload.cropId) payload.cropId = null;

    const res = await api.post('/expense', payload);
    await fetchExpenses(); // Refresh to get populated crop info
    return res.data;
  };

  const deleteExpense = async (id) => {
    await api.delete(`/expense/${id}`);
    setExpenses(prev => prev.filter(e => e._id !== id));
  };

  return { expenses, loading, error, addExpense, deleteExpense, refetch: fetchExpenses };
}
