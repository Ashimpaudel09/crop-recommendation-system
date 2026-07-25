"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Sprout, Plus, MoreVertical, Search, CheckCircle2, XCircle } from 'lucide-react';
import { useCrops } from '@/hooks/useCrops';
import { formatDate, CROP_STATUSES } from '@/lib/constants';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card, EmptyState, Badge } from '@/components/ui/components';

const cropSchema = z.object({
  cropName: z.string().min(2, 'Crop name is required'),
  plantingDate: z.string().nonempty('Planting date is required'),
  status: z.string().optional(),
});

export default function CropsPage() {
  const { crops, loading, addCrop, updateCropStatus } = useCrops();
  const [showAddForm, setShowAddForm] = useState(false);
  const [search, setSearch] = useState('');

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(cropSchema),
    defaultValues: { status: 'growing' }
  });

  const onSubmit = async (data) => {
    try {
      await addCrop(data);
      setShowAddForm(false);
      reset();
    } catch (err) {
      alert(err.message || 'Failed to add crop');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateCropStatus(id, newStatus);
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const filteredCrops = crops.filter(c => 
    c.cropName.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case 'growing': return <Badge variant="info">Growing</Badge>;
      case 'harvested': return <Badge variant="success">Harvested</Badge>;
      case 'failed': return <Badge variant="danger">Failed</Badge>;
      default: return <Badge variant="default">{status}</Badge>;
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><div className="spinner spinner-lg text-accent" /></div>;
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary mb-1">My Crops</h1>
          <p className="text-sm text-text-secondary">Manage your crop cycles and track progress.</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus size={16} />
          {showAddForm ? 'Cancel' : 'Add New Crop'}
        </Button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <Card className="p-6 bg-surface-raised/50 border-accent/20 border">
          <h3 className="text-sm font-semibold mb-4 text-text-primary">Add New Crop</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
            <Input
              label="Crop Name"
              placeholder="e.g. Rice, Wheat, Tomatoes"
              error={errors.cropName?.message}
              {...register('cropName')}
            />
            <Input
              label="Planting Date"
              type="date"
              error={errors.plantingDate?.message}
              {...register('plantingDate')}
            />
            <div className="flex flex-col gap-1.5 h-full justify-end pb-[2px]">
              <Button type="submit" isLoading={isSubmitting} className="w-full">
                Save Crop
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Toolbar */}
      {!showAddForm && crops.length > 0 && (
        <div className="flex items-center gap-4 bg-surface-card p-2 rounded-lg border border-border shadow-sm">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search crops..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-transparent border-none focus:outline-none focus:ring-0 text-text-primary"
            />
          </div>
        </div>
      )}

      {/* Crop List */}
      {crops.length === 0 ? (
        <EmptyState
          icon={Sprout}
          title="No crops yet"
          description="Start tracking your farm by adding your first crop cycle."
          action={<Button onClick={() => setShowAddForm(true)}>Add First Crop</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCrops.map(crop => (
            <Card key={crop._id} className="p-5 flex flex-col transition-all duration-200 hover:shadow-md">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent-light text-accent flex items-center justify-center shrink-0">
                    <Sprout size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary text-[15px]">{crop.cropName}</h3>
                    <p className="text-[11px] text-text-muted uppercase tracking-wider mt-0.5">
                      Planted {formatDate(crop.plantingDate)}
                    </p>
                  </div>
                </div>
                {getStatusBadge(crop.status)}
              </div>
              
              <div className="mt-auto pt-4 border-t border-border flex items-center gap-2">
                <select 
                  className="w-full text-xs bg-surface border border-border rounded-md px-2 py-1.5 focus:outline-none focus:border-accent"
                  value={crop.status}
                  onChange={(e) => handleStatusChange(crop._id, e.target.value)}
                >
                  {CROP_STATUSES.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
