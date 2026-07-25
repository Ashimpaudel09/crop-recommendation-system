"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { DollarSign, Plus, Search, Trash2, Sprout } from 'lucide-react';
import { useIncomes } from '@/hooks/useIncomes';
import { useCrops } from '@/hooks/useCrops';
import { formatDate, formatCurrency, INCOME_SOURCES } from '@/lib/constants';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card, EmptyState, Badge } from '@/components/ui/components';

const incomeSchema = z.object({
  amount: z.coerce.number().positive('Amount must be greater than zero'),
  source: z.string().nonempty('Source is required'),
  incomeDate: z.string().nonempty('Date is required'),
  description: z.string().max(500, 'Description too long').optional(),
  cropId: z.string().optional().or(z.literal('')),
  quantitySold: z.coerce.number().min(0).optional(),
  unitPrice: z.coerce.number().min(0).optional(),
});

export default function IncomePage() {
  const { incomes, loading: incomesLoading, addIncome, deleteIncome } = useIncomes();
  const { crops, loading: cropsLoading } = useCrops();
  const [showAddForm, setShowAddForm] = useState(false);
  const [search, setSearch] = useState('');
  const [filterSource, setFilterSource] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(incomeSchema),
    defaultValues: { incomeDate: new Date().toISOString().split('T')[0] }
  });

  const onSubmit = async (data) => {
    try {
      await addIncome(data);
      setShowAddForm(false);
      reset();
    } catch (err) {
      alert(err.message || 'Failed to add income');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this income record?')) {
      try {
        await deleteIncome(id);
      } catch (err) {
        alert('Failed to delete income');
      }
    }
  };

  let filteredIncomes = incomes.filter(i => {
    const matchesSearch = i.source.toLowerCase().includes(search.toLowerCase()) ||
      (i.description && i.description.toLowerCase().includes(search.toLowerCase())) ||
      (i.cropId?.cropName && i.cropId.cropName.toLowerCase().includes(search.toLowerCase()));
      
    const matchesSource = filterSource === 'all' || i.source === filterSource;
    
    return matchesSearch && matchesSource;
  });

  filteredIncomes.sort((a, b) => {
    if (sortOrder === 'amount-asc') return a.amount - b.amount;
    if (sortOrder === 'amount-desc') return b.amount - a.amount;
    if (sortOrder === 'oldest') return new Date(a.incomeDate) - new Date(b.incomeDate);
    return new Date(b.incomeDate) - new Date(a.incomeDate);
  });

  const getSourceBadge = (source) => {
    const src = INCOME_SOURCES.find(s => s.value === source);
    return <Badge variant="success" className="bg-success-light/50 border border-success/20">{src ? src.label : source}</Badge>;
  };

  if (incomesLoading || cropsLoading) {
    return <div className="flex justify-center py-20"><div className="spinner spinner-lg text-accent" /></div>;
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary mb-1">Income</h1>
          <p className="text-sm text-text-secondary">Track revenue from crops, livestock, and other sources.</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus size={16} />
          {showAddForm ? 'Cancel' : 'Log Income'}
        </Button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <Card className="p-6 bg-surface-raised/50 border-accent/20 border">
          <h3 className="text-sm font-semibold mb-4 text-text-primary">Log New Income</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
            <Input
              label="Amount (NPR)"
              type="number"
              step="0.01"
              placeholder="0.00"
              error={errors.amount?.message}
              {...register('amount')}
            />
            <Select
              label="Source"
              options={INCOME_SOURCES}
              error={errors.source?.message}
              {...register('source')}
            />
            <Input
              label="Date"
              type="date"
              error={errors.incomeDate?.message}
              {...register('incomeDate')}
            />
            <Select
              label="Associated Crop (Optional)"
              options={crops.map(c => ({ value: c._id, label: c.cropName }))}
              error={errors.cropId?.message}
              {...register('cropId')}
            />
            <Input
              label="Quantity Sold (Optional)"
              type="number"
              placeholder="e.g. kg, units"
              error={errors.quantitySold?.message}
              {...register('quantitySold')}
            />
            <Input
              label="Unit Price (Optional)"
              type="number"
              step="0.01"
              error={errors.unitPrice?.message}
              {...register('unitPrice')}
            />
            <div className="lg:col-span-3">
              <Input
                label="Description"
                placeholder="Details about this revenue..."
                error={errors.description?.message}
                {...register('description')}
              />
            </div>
            <div className="lg:col-span-3 flex justify-end mt-2">
              <Button type="submit" isLoading={isSubmitting} className="min-w-[120px]">
                Save Income
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Toolbar */}
      {!showAddForm && incomes.length > 0 && (
        <div className="flex items-center gap-4 bg-surface-card p-2 rounded-lg border border-border shadow-sm">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search income records..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-transparent border-none focus:outline-none focus:ring-0 text-text-primary"
            />
          </div>
          
          <div className="flex items-center gap-2 pr-2 border-l border-border pl-4">
            <select
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value)}
              className="bg-transparent border-none focus:outline-none text-sm text-text-secondary cursor-pointer hover:text-text-primary hidden sm:block"
            >
              <option value="all">All Sources</option>
              {INCOME_SOURCES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
            
            <div className="hidden sm:block w-px h-4 bg-border mx-2"></div>
            
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="bg-transparent border-none focus:outline-none text-sm text-text-secondary cursor-pointer hover:text-text-primary"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="amount-desc">High to Low</option>
              <option value="amount-asc">Low to High</option>
            </select>
          </div>
        </div>
      )}

      {/* Income List */}
      {incomes.length === 0 ? (
        <EmptyState
          icon={DollarSign}
          title="No income logged"
          description="Record your sales, grants, and other revenue streams."
          action={<Button onClick={() => setShowAddForm(true)}>Log First Income</Button>}
        />
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Source</th>
                <th>Description</th>
                <th>Crop</th>
                <th>Qty / Price</th>
                <th className="text-right">Amount</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {filteredIncomes.map((income) => (
                <tr key={income._id}>
                  <td className="whitespace-nowrap font-medium text-text-primary">{formatDate(income.incomeDate)}</td>
                  <td>{getSourceBadge(income.source)}</td>
                  <td className="max-w-[200px] truncate" title={income.description}>{income.description || '—'}</td>
                  <td>
                    {income.cropId ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-accent-light text-accent-text px-2 py-0.5 rounded-md">
                        <Sprout size={12} /> {income.cropId.cropName}
                      </span>
                    ) : '—'}
                  </td>
                  <td className="text-xs text-text-muted">
                    {income.quantitySold ? `${income.quantitySold} @ ${formatCurrency(income.unitPrice)}` : '—'}
                  </td>
                  <td className="text-right font-semibold text-success">+{formatCurrency(income.amount)}</td>
                  <td className="text-right">
                    <button 
                      onClick={() => handleDelete(income._id)}
                      className="p-1.5 text-text-muted hover:text-danger hover:bg-danger-light rounded-md transition-colors"
                      title="Delete record"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
