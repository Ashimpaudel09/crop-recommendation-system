"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Sprout, TestTube, Thermometer, CloudRain, Wind, Calculator, RefreshCcw } from 'lucide-react';
import mlApi from '@/lib/mlApi';
import { Navbar } from '@/components/layout/Navbar';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/components';

const predictionSchema = z.object({
  N: z.coerce.number().min(0).max(200, 'Nitrogen should be between 0-200'),
  P: z.coerce.number().min(0).max(200, 'Phosphorous should be between 0-200'),
  K: z.coerce.number().min(0).max(250, 'Potassium should be between 0-250'),
  temperature: z.coerce.number().min(-10).max(60, 'Temperature should be between -10 and 60'),
  humidity: z.coerce.number().min(0).max(100, 'Humidity is a percentage (0-100)'),
  ph: z.coerce.number().min(0).max(14, 'pH must be between 0 and 14'),
  rainfall: z.coerce.number().min(0).max(500, 'Rainfall should be between 0-500mm'),
  model: z.enum(['logistic_regression', 'random_forest'])
});

export default function RecommendPage() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [warning, setWarning] = useState(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(predictionSchema),
    defaultValues: { model: 'random_forest' }
  });

  const onSubmit = async (data) => {
    try {
      setResult(null);
      setError(null);
      setWarning(null);

      if (
        data.temperature < 8 || data.temperature > 45 ||
        data.ph < 3.5 || data.ph > 10 ||
        data.rainfall < 20 || data.rainfall > 300 ||
        data.humidity < 14 || data.N > 140 || data.P > 145 || data.K > 205
      ) {
        setWarning("Some of your inputs are outside the typical optimal ranges. The model will still provide predictions, but they might be slightly less accurate.");
      }

      // The API expects this exact payload
      const response = await mlApi.post('/predict', data);
      
      // Add fake delay to show loading animation and make it feel more "process heavy"
      await new Promise(r => setTimeout(r, 800));
      
      setResult({
        predictions: response.data.predictions,
        modelUsed: response.data.model,
        confidence: response.data.model === 'random_forest' ? 'High' : 'Moderate'
      });
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to communicate with the ML service. Is it running?');
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setWarning(null);
    reset();
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col items-center p-6 md:p-12">
        
        <div className="w-full max-w-4xl text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent-light text-accent mb-6 shadow-sm">
            <Calculator size={32} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary tracking-tight mb-4">
            AI Crop Recommendation
          </h1>
          <p className="text-[17px] text-text-secondary max-w-[600px] mx-auto leading-relaxed">
            Enter your soil parameters and environmental conditions below. Our machine learning models will analyze the data to recommend the most suitable crop for your farm.
          </p>
        </div>

        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          
          {/* Input Form */}
          <Card className={`p-6 md:p-8 lg:col-span-3 transition-opacity duration-300 ${result ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
            <h3 className="text-[15px] font-semibold text-text-primary mb-6 border-b border-border pb-3 flex items-center gap-2">
              <TestTube size={18} className="text-accent" /> Environmental & Soil Data
            </h3>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-surface-raised p-4 rounded-xl border border-border">
                <Input
                  label="Nitrogen (N)"
                  type="number"
                  placeholder="e.g. 90"
                  error={errors.N?.message}
                  {...register('N')}
                />
                <Input
                  label="Phosphorous (P)"
                  type="number"
                  placeholder="e.g. 42"
                  error={errors.P?.message}
                  {...register('P')}
                />
                <Input
                  label="Potassium (K)"
                  type="number"
                  placeholder="e.g. 43"
                  error={errors.K?.message}
                  {...register('K')}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label={<span className="flex items-center gap-1.5"><Thermometer size={14}/> Temperature (°C)</span>}
                  type="number"
                  step="0.1"
                  placeholder="e.g. 20.8"
                  error={errors.temperature?.message}
                  {...register('temperature')}
                />
                <Input
                  label={<span className="flex items-center gap-1.5"><Wind size={14}/> Humidity (%)</span>}
                  type="number"
                  step="0.1"
                  placeholder="e.g. 82.0"
                  error={errors.humidity?.message}
                  {...register('humidity')}
                />
                <Input
                  label={<span className="flex items-center gap-1.5"><TestTube size={14}/> Soil pH</span>}
                  type="number"
                  step="0.1"
                  placeholder="e.g. 6.5"
                  error={errors.ph?.message}
                  {...register('ph')}
                />
                <Input
                  label={<span className="flex items-center gap-1.5"><CloudRain size={14}/> Rainfall (mm)</span>}
                  type="number"
                  step="0.1"
                  placeholder="e.g. 202.9"
                  error={errors.rainfall?.message}
                  {...register('rainfall')}
                />
              </div>

              <div className="mt-2 border-t border-border pt-4">
                <Select
                  label="Algorithm Selection"
                  options={[
                    { value: 'random_forest', label: 'Random Forest (Recommended - Higher Accuracy)' },
                    { value: 'logistic_regression', label: 'Logistic Regression (Faster Baseline)' }
                  ]}
                  error={errors.model?.message}
                  {...register('model')}
                />
              </div>

              <Button type="submit" size="lg" isLoading={isSubmitting} className="w-full mt-2 h-12 text-[15px]">
                {isSubmitting ? 'Analyzing Data...' : 'Generate Recommendation'}
              </Button>
              
              {error && (
                <div className="p-3 text-sm text-danger-text bg-danger-light border border-danger-light rounded-md text-center">
                  {error}
                </div>
              )}
            </form>
          </Card>

          {/* Result Panel */}
          <div className="lg:col-span-2 relative h-full min-h-[400px]">
            {isSubmitting ? (
              <Card className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-surface-card border-accent border-2 border-dashed">
                <div className="relative w-20 h-20 mb-6">
                  <div className="absolute inset-0 border-4 border-surface-raised rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
                  <Sprout size={24} className="absolute inset-0 m-auto text-accent animate-pulse" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">Analyzing Parameters...</h3>
                <p className="text-sm text-text-secondary text-center">Passing data through machine learning pipeline.</p>
              </Card>
            ) : result ? (
              <Card className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-surface-card shadow-xl border-t-4 border-t-accent animate-in zoom-in-95 duration-500 overflow-y-auto">
                <p className="text-sm font-medium text-text-secondary uppercase tracking-wider mb-6">Top 3 Recommendations</p>
                
                <div className="w-full flex flex-col gap-3 mb-6">
                  {result.predictions.map((crop, index) => (
                    <div key={index} className={`flex items-center gap-4 p-4 rounded-xl border ${index === 0 ? 'bg-accent-light/30 border-accent/50 shadow-[var(--shadow-sm)]' : 'bg-surface border-border'}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${index === 0 ? 'bg-accent text-white' : 'bg-surface-raised text-text-muted'}`}>
                        #{index + 1}
                      </div>
                      <h2 className={`font-bold capitalize ${index === 0 ? 'text-2xl text-text-primary' : 'text-lg text-text-secondary'}`}>
                        {crop}
                      </h2>
                    </div>
                  ))}
                </div>

                {warning && (
                  <div className="w-full p-3 mb-6 text-sm text-warning-text bg-warning-light border border-warning/30 rounded-lg text-center leading-relaxed animate-in fade-in slide-in-from-bottom-2">
                    <strong>Note:</strong> {warning}
                  </div>
                )}
                
                <div className="w-full bg-surface p-4 rounded-xl border border-border mb-6">
                  <div className="flex justify-between items-center mb-2 text-sm">
                    <span className="text-text-muted">Model Used</span>
                    <span className="font-medium text-text-primary capitalize">{result.modelUsed.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-text-muted">Confidence Indicator</span>
                    <span className="inline-flex px-2 py-0.5 rounded text-xs font-semibold bg-success-light text-success">
                      {result.confidence}
                    </span>
                  </div>
                </div>

                <Button variant="secondary" className="w-full" onClick={handleReset}>
                  <RefreshCcw size={16} /> Run Another Analysis
                </Button>
              </Card>
            ) : (
              <Card className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-surface-card border-dashed">
                <div className="w-16 h-16 rounded-full bg-surface-raised text-text-muted flex items-center justify-center mb-4">
                  <Calculator size={28} />
                </div>
                <h3 className="text-lg font-medium text-text-primary mb-2 text-center">Awaiting Data</h3>
                <p className="text-sm text-text-secondary text-center">Fill out the form and submit to see the AI prediction here.</p>
              </Card>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
