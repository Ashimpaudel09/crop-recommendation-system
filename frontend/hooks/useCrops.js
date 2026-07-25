"use client";

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';

export function useCrops() {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCrops = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/crop');
      setCrops(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch crops');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCrops();
  }, [fetchCrops]);

  const addCrop = async (data) => {
    const res = await api.post('/crop', data);
    setCrops(prev => [res.data.crop, ...prev]);
    return res.data;
  };

  const updateCropStatus = async (id, status) => {
    const res = await api.patch(`/crop/${id}/status`, { status });
    setCrops(prev => prev.map(c => c._id === id ? res.data.crop : c));
    return res.data;
  };

  return { crops, loading, error, addCrop, updateCropStatus, refetch: fetchCrops };
}
