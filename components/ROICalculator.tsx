'use client';

import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Calculator, AlertTriangle, Skull, DollarSign } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

const ROICalculator: React.FC = () => {
  const { t } = useTranslation();
  
  // Estado inicial: Pago mensual y años
  const [monthlyPayment, setMonthlyPayment] = useState(200);
  const [yearsPayingSetter, setYearsPayingSetter] = useState(2);
  
  // Datos para el gráfico y deuda
  const [chartData, setChartData] = useState<any[]>([]);
  const [totalDebt, setTotalDebt] = useState(0);
  const [timesCouldGraduate, setTimesCouldGraduate] = useState(0);

  useEffect(() => {
    const data = [];
    const pukaTotal = 900; // Costo fijo Puka (3 meses x $300)
    const totalMonths = yearsPayingSetter * 12;
    
    // Calcular deuda acumulada
    const calculatedDebt = monthlyPayment * totalMonths;
    setTotalDebt(calculatedDebt);
    setTimesCouldGraduate(Math.floor(calculatedDebt / pukaTotal));
    
    // Generar datos para el gráfico
    for (let month = 0; month <= totalMonths; month++) {
      const agencyDebt = monthlyPayment * month;
      
      data.push({
        month: `M${month}`,
        Agencia: agencyDebt,
        Puka: pukaTotal,
        monthIndex: month
      });
    }

    setChartData(data);

  }, [monthlyPayment, yearsPayingSetter]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-sm shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="bg-puka-black dark:bg-gray-900 text-white p-6">
        <div className="flex items-center gap-3">
          <Skull className="text-puka-red" size={24} />
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
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              {t('roi.label_agency_monthly')}
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
              <input 
                type="number" 
                value={monthlyPayment}
                onChange={(e) => setMonthlyPayment(Number(e.target.value))}
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 pl-8 pr-4 py-3 rounded-sm font-bold text-lg focus:outline-none focus:border-puka-red dark:text-white"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">{t('roi.hint_agency_monthly')}</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              {t('roi.label_agency_setup')}
            </label>
            <div className="flex items-center gap-3">
              <input 
                type="range" 
                min="1" 
                max="10" 
                value={yearsPayingSetter}
                onChange={(e) => setYearsPayingSetter(Number(e.target.value))}
                className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-puka-red"
              />
              <span className="bg-puka-red text-white font-bold px-3 py-1 rounded-sm min-w-[60px] text-center">
                {yearsPayingSetter} {t('roi.years_label')}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">{t('roi.hint_agency_setup')}</p>
          </div>

          {/* Resultado Dramático */}
          <div className="bg-puka-red/10 dark:bg-puka-red/20 p-5 rounded-sm border-2 border-puka-red">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-puka-red mt-1" size={24} />
              <div>
                <span className="block text-xs font-bold text-puka-red uppercase tracking-wider">{t('roi.debt_accumulated')}</span>
                <span className="block text-4xl font-bold text-puka-red font-display">
                  ${totalDebt.toLocaleString()}
                </span>
                <span className="text-xs text-gray-600 dark:text-gray-400 leading-tight block mt-2">
                  {t('roi.savings_desc')}
                </span>
              </div>
            </div>
          </div>

          {/* Contraste con Puka */}
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-sm border border-green-200 dark:border-green-800">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {t('roi.vs_puka')} <span className="font-bold text-green-600 dark:text-green-400">{t('roi.puka_total')}</span>
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {t('roi.debt_warning')} <span className="font-bold text-puka-red">{timesCouldGraduate}</span> {t('roi.debt_times')}.
            </p>
          </div>
        </div>

        {/* Gráfico */}
        <div className="lg:col-span-2 relative" style={{ minHeight: '300px', height: '300px', width: '100%' }}>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorDebt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E30613" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#E30613" stopOpacity={0.05}/>
                </linearGradient>
                <linearGradient id="colorFreedom" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
              <XAxis 
                dataKey="month" 
                tick={{fontSize: 10, fill: '#888'}} 
                tickFormatter={(value, index) => {
                  const monthIndex = chartData[index]?.monthIndex;
                  if (monthIndex !== undefined && monthIndex % 12 === 0) {
                    return `Año ${monthIndex / 12}`;
                  }
                  return '';
                }} 
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
                stroke="#E30613" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorDebt)" 
                name={t('roi.chart_agency')}
              />
              <Area 
                type="monotone" 
                dataKey="Puka" 
                stroke="#22c55e" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorFreedom)" 
                name={t('roi.chart_puka')}
              />
            </AreaChart>
          </ResponsiveContainer>
          
          <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur border border-gray-200 dark:border-gray-700 p-2 rounded-sm text-xs shadow-sm max-w-[200px]">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle size={12} className="text-puka-red" />
              <span className="font-bold dark:text-white">{t('roi.note_title')}</span>
            </div>
            <span className="dark:text-gray-300">{t('roi.note_desc')}</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ROICalculator;