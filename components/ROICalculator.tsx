'use client';

import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Calculator, AlertCircle, TrendingDown } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

const ROICalculator: React.FC = () => {
  const { t } = useTranslation();
  
  // Estado inicial: Agencia promedio
  const [agencyMonthly, setAgencyMonthly] = useState(200);
  const [agencySetup, setAgencySetup] = useState(1500);
  
  // Datos para el gráfico
  const [chartData, setChartData] = useState<any[]>([]);
  const [totalSavings, setTotalSavings] = useState(0);

  useEffect(() => {
    const data = [];
    const pukaTotal = 900; // Costo fijo Puka (3 meses x $300)
    
    // Mantenimiento opcional Puka después de 3 meses (promedio conservador de hosting/chat)
    const pukaMonthlyMaintenance = 20; 

    for (let month = 0; month <= 24; month++) { // Proyección a 2 años
      // Costo Agencia: Setup + (Mensualidad * Meses)
      const agencyCost = agencySetup + (agencyMonthly * month);
      
      // Costo Puka: 
      // Mes 0-3: Pagos de $300. 
      // Mes 4+: Mantenimiento mínimo ($20)
      let pukaCost = 0;
      if (month <= 3) {
        pukaCost = Math.min(month * 300, 900);
      } else {
        pukaCost = 900 + ((month - 3) * pukaMonthlyMaintenance);
      }

      data.push({
        month: `Mes ${month}`,
        Agencia: agencyCost,
        PukaDigital: pukaCost,
        monthIndex: month
      });
    }

    setChartData(data);
    
    // Calcular ahorro a 2 años
    const finalAgency = agencySetup + (agencyMonthly * 24);
    const finalPuka = 900 + (21 * pukaMonthlyMaintenance);
    setTotalSavings(finalAgency - finalPuka);

  }, [agencyMonthly, agencySetup]);

  return (
    <div className="bg-white rounded-sm shadow-xl border border-gray-200 overflow-hidden">
      <div className="bg-puka-black text-white p-6">
        <div className="flex items-center gap-3">
          <Calculator className="text-puka-red" size={24} />
          <h3 className="font-display font-bold text-xl md:text-2xl">{t('roi.title')}</h3>
        </div>
        <p className="text-gray-400 text-sm mt-2">
          {t('roi.subtitle')}
        </p>
      </div>

      <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Controles */}
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              {t('roi.label_agency_monthly')}
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
              <input 
                type="number" 
                value={agencyMonthly}
                onChange={(e) => setAgencyMonthly(Number(e.target.value))}
                className="w-full bg-gray-50 border border-gray-200 pl-8 pr-4 py-3 rounded-sm font-bold text-lg focus:outline-none focus:border-puka-red"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">{t('roi.hint_agency_monthly')}</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              {t('roi.label_agency_setup')}
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
              <input 
                type="number" 
                value={agencySetup}
                onChange={(e) => setAgencySetup(Number(e.target.value))}
                className="w-full bg-gray-50 border border-gray-200 pl-8 pr-4 py-3 rounded-sm font-bold text-lg focus:outline-none focus:border-puka-red"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">{t('roi.hint_agency_setup')}</p>
          </div>

          <div className="bg-puka-beige/30 p-4 rounded-sm border border-puka-beige">
            <div className="flex items-start gap-3">
              <TrendingDown className="text-green-600 mt-1" size={20} />
              <div>
                <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider">{t('roi.savings_label')}</span>
                <span className="block text-3xl font-bold text-puka-red font-display">
                  ${totalSavings.toLocaleString()}
                </span>
                <span className="text-xs text-gray-600 leading-tight block mt-1">
                  {t('roi.savings_desc')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Gráfico */}
        <div className="lg:col-span-2 relative" style={{ minHeight: '300px', height: '300px', width: '100%' }}>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorAgencia" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9CA3AF" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#9CA3AF" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorPuka" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#c7171e" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#c7171e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                tick={{fontSize: 10, fill: '#888'}} 
                tickFormatter={(value, index) => index % 6 === 0 ? value : ''} 
              />
              <YAxis tick={{fontSize: 10, fill: '#888'}} tickFormatter={(value) => `$${value}`} />
              <Tooltip 
                contentStyle={{ borderRadius: '4px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
              />
              <Legend verticalAlign="top" height={36} />
              <Area 
                type="monotone" 
                dataKey="Agencia" 
                stroke="#6B7280" 
                strokeWidth={2} 
                fillOpacity={1} 
                fill="url(#colorAgencia)" 
                name={t('roi.chart_agency')}
              />
              <Area 
                type="monotone" 
                dataKey="PukaDigital" 
                stroke="#c7171e" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorPuka)" 
                name={t('roi.chart_puka')}
              />
            </AreaChart>
          </ResponsiveContainer>
          
          <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur border border-gray-200 p-2 rounded-sm text-xs shadow-sm max-w-[200px]">
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle size={12} className="text-puka-red" />
              <span className="font-bold">{t('roi.note_title')}</span>
            </div>
            {t('roi.note_desc')}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ROICalculator;