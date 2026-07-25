"use client";

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';

export function useIncomes() {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchIncomes = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/income');
      setIncomes(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch incomes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIncomes();
  }, [fetchIncomes]);

  const addIncome = async (data) => {
    const payload = { ...data };
    if (!payload.cropId) payload.cropId = null;

    const res = await api.post('/income', payload);
    await fetchIncomes();
    return res.data;
  };

  const deleteIncome = async (id) => {
    await api.delete(`/income/${id}`);
    setIncomes(prev => prev.filter(i => i._id !== id));
  };

  return { incomes, loading, error, addIncome, deleteIncome, refetch: fetchIncomes };
}
