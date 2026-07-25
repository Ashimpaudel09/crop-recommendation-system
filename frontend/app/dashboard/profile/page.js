"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UserCircle, MapPin, Phone, Droplets, Map, Sprout } from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Card, Alert } from '@/components/ui/components';

const profileSchema = z.object({
  phone: z.string().regex(/^[0-9]{10}$/, 'Must be a 10-digit number').optional().or(z.literal('')),
  location: z.object({
    province: z.string().optional(),
    district: z.string().optional(),
    municipality: z.string().optional(),
    ward: z.coerce.number().min(1, 'Invalid ward').optional().or(z.literal('')),
  }),
  farmSize: z.coerce.number().min(0, 'Cannot be negative').optional().or(z.literal('')),
  irrigationType: z.string().optional(),
  preferredCropCategory: z.string().optional(),
});

export default function ProfilePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(profileSchema)
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/farmer');
        if (res.data) {
          reset(res.data);
        }
      } catch (err) {
        console.error('Failed to load profile', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [reset]);

  const onSubmit = async (data) => {
    try {
      setAlert(null);
      // Clean up empty strings to null for optional numbers
      if (data.farmSize === '') data.farmSize = null;
      if (data.location.ward === '') data.location.ward = null;
      
      await api.put('/farmer', data);
      setAlert({ type: 'success', message: 'Profile updated successfully!' });
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Failed to update profile' });
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="spinner spinner-lg text-accent" /></div>;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary mb-1">Farmer Profile</h1>
        <p className="text-sm text-text-secondary">Manage your personal information and farm details.</p>
      </div>

      {alert && <Alert type={alert.type} message={alert.message} />}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        
        {/* Account Info Card (Read Only) */}
        <Card className="p-6 md:col-span-1">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-20 h-20 bg-accent-light text-accent rounded-full flex items-center justify-center mb-4">
              <UserCircle size={40} strokeWidth={1.5} />
            </div>
            <h2 className="text-lg font-semibold text-text-primary">
              {user?.firstname} {user?.lastname}
            </h2>
            <p className="text-sm text-text-muted">{user?.email}</p>
            <div className="mt-3 px-3 py-1 bg-surface-raised rounded-full text-xs font-medium text-text-secondary uppercase tracking-wider">
              Verified Farmer
            </div>
          </div>
          <div className="pt-4 border-t border-border">
            <p className="text-xs text-text-muted text-center leading-relaxed">
              Account information (name and email) cannot be changed currently.
            </p>
          </div>
        </Card>

        {/* Farm Profile Form */}
        <Card className="p-6 md:col-span-2">
          <h3 className="text-[15px] font-semibold text-text-primary mb-6 border-b border-border pb-3">Farm Details</h3>
          
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={<span className="flex items-center gap-1.5"><Phone size={14} className="text-text-muted"/> Phone Number</span>}
                placeholder="98XXXXXXXX"
                error={errors.phone?.message}
                {...register('phone')}
              />
              <Input
                label={<span className="flex items-center gap-1.5"><Map size={14} className="text-text-muted"/> Total Farm Size (Acres/Hectares)</span>}
                type="number"
                step="0.01"
                placeholder="e.g. 2.5"
                error={errors.farmSize?.message}
                {...register('farmSize')}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label={<span className="flex items-center gap-1.5"><Droplets size={14} className="text-text-muted"/> Irrigation Type</span>}
                options={[
                  { value: 'Rainfed', label: 'Rainfed' },
                  { value: 'Canal', label: 'Canal' },
                  { value: 'Tube well', label: 'Tube well' },
                  { value: 'Drip', label: 'Drip' },
                  { value: 'Sprinkler', label: 'Sprinkler' }
                ]}
                error={errors.irrigationType?.message}
                {...register('irrigationType')}
              />
              <Select
                label={<span className="flex items-center gap-1.5"><Sprout size={14} className="text-text-muted"/> Preferred Crop Category</span>}
                options={[
                  { value: 'Cereal', label: 'Cereal' },
                  { value: 'Vegetable', label: 'Vegetable' },
                  { value: 'Fruit', label: 'Fruit' },
                  { value: 'Cash Crop', label: 'Cash Crop' }
                ]}
                error={errors.preferredCropCategory?.message}
                {...register('preferredCropCategory')}
              />
            </div>

            <div className="mt-2">
              <h4 className="text-sm font-medium text-text-primary mb-4 flex items-center gap-1.5 border-b border-border pb-2">
                <MapPin size={14} className="text-text-muted"/> Location details (Nepal)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Province"
                  placeholder="e.g. Bagmati"
                  error={errors.location?.province?.message}
                  {...register('location.province')}
                />
                <Input
                  label="District"
                  placeholder="e.g. Kathmandu"
                  error={errors.location?.district?.message}
                  {...register('location.district')}
                />
                <Input
                  label="Municipality/VDC"
                  placeholder="e.g. Kirtipur"
                  error={errors.location?.municipality?.message}
                  {...register('location.municipality')}
                />
                <Input
                  label="Ward No."
                  type="number"
                  placeholder="e.g. 5"
                  error={errors.location?.ward?.message}
                  {...register('location.ward')}
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-border mt-2">
              <Button type="submit" isLoading={isSubmitting} className="min-w-[140px]">
                Save Changes
              </Button>
            </div>

          </form>
        </Card>

      </div>
    </div>
  );
}
