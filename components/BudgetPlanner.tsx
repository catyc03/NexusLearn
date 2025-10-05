import React, { useState, useCallback } from 'react';
import { generateBudgetPlan } from '../services/geminiService';
import { BudgetPlan } from '../types';
import Card from './common/Card';
import Input from './common/Input';
import Button from './common/Button';
import LoadingSpinner from './common/LoadingSpinner';
import { PieChart, Pie, Cell, Legend, ResponsiveContainer, Sector } from 'recharts';
import { useTheme } from '../context/ThemeContext';

interface Expense {
    id: number;
    category: string;
    amount: string;
}

const COLORS = ['#0891b2', '#06b6d4', '#67e8f9', '#f97316', '#fb923c', '#fdba74', '#8b5cf6'];

const BudgetPlanner: React.FC = () => {
    const { theme } = useTheme();
    const [income, setIncome] = useState('');
    const [expenses, setExpenses] = useState<Expense[]>([{ id: 1, category: 'Rent', amount: '' }]);
    const [budgetPlan, setBudgetPlan] = useState<BudgetPlan | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);

    const onPieEnter = useCallback((_: any, index: number) => {
        setActiveIndex(index);
    }, [setActiveIndex]);

    const renderActiveShape = (props: any) => {
        const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
        const labelColor = theme === 'dark' ? '#f1f5f9' : '#1e293b';
        const subLabelColor = theme === 'dark' ? '#94a3b8' : '#475569';

        return (
            <g>
            <text x={cx} y={cy} dy={-10} textAnchor="middle" fill={labelColor} className="text-xl font-bold">
                {payload.category}
            </text>
            <text x={cx} y={cy} dy={15} textAnchor="middle" fill={subLabelColor} className="text-sm">
                {`$${value.toFixed(2)} (${(percent * 100).toFixed(0)}%)`}
            </text>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
            />
            <Sector
                cx={cx}
                cy={cy}
                startAngle={startAngle}
                endAngle={endAngle}
                innerRadius={outerRadius + 6}
                outerRadius={outerRadius + 10}
                fill={fill}
            />
            </g>
        );
    };

    const handleAddExpense = () => {
        setExpenses([...expenses, { id: Date.now(), category: '', amount: '' }]);
    };
    
    const handleRemoveExpense = (id: number) => {
        setExpenses(expenses.filter(exp => exp.id !== id));
    };

    const handleExpenseChange = (id: number, field: 'category' | 'amount', value: string) => {
        setExpenses(expenses.map(exp => exp.id === id ? { ...exp, [field]: value } : exp));
    };

    const handleGeneratePlan = useCallback(async () => {
        const numericIncome = parseFloat(income);
        if (isNaN(numericIncome) || numericIncome <= 0) {
            setError('Please enter a valid monthly income.');
            return;
        }

        const validExpenses = expenses
            .map(e => ({ category: e.category, amount: parseFloat(e.amount) }))
            .filter(e => e.category.trim() && !isNaN(e.amount) && e.amount > 0);

        if (validExpenses.length === 0) {
            setError('Please add at least one valid expense.');
            return;
        }
        
        setIsLoading(true);
        setError('');
        setBudgetPlan(null);

        try {
            const plan = await generateBudgetPlan(numericIncome, validExpenses);
            setBudgetPlan(plan);
        } catch (err: any) {
            setError(err.message || 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [income, expenses]);
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-1 text-slate-800 dark:text-slate-100">Student Budget Planner</h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-6">Enter your income and expenses to create a personalized budget.</p>
                    
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="income" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Monthly Income ($)</label>
                            <Input id="income" type="number" value={income} onChange={e => setIncome(e.target.value)} placeholder="e.g., 1200" disabled={isLoading} />
                        </div>
                        <div>
                            <h3 className="text-lg font-medium text-slate-700 dark:text-slate-200 mb-2">Monthly Expenses</h3>
                            <div className="space-y-3">
                                {expenses.map((exp) => (
                                    <div key={exp.id} className="flex items-center gap-2">
                                        <Input type="text" value={exp.category} onChange={e => handleExpenseChange(exp.id, 'category', e.target.value)} placeholder="Category (e.g., Rent)" className="flex-grow" disabled={isLoading} aria-label="Expense Category"/>
                                        <Input type="number" value={exp.amount} onChange={e => handleExpenseChange(exp.id, 'amount', e.target.value)} placeholder="Amount" className="w-32" disabled={isLoading} aria-label="Expense Amount"/>
                                        <button onClick={() => handleRemoveExpense(exp.id)} className="text-red-500 h-10 w-10 flex items-center justify-center rounded-lg hover:bg-red-100/50 dark:hover:bg-red-500/10 disabled:opacity-50 text-2xl font-light" disabled={expenses.length <= 1 || isLoading} aria-label="Remove Expense">&times;</button>
                                    </div>
                                ))}
                            </div>
                            <Button variant="secondary" onClick={handleAddExpense} className="mt-3" disabled={isLoading}>+ Add Expense</Button>
                        </div>
                    </div>
                    
                    <div className="mt-8">
                        <Button onClick={handleGeneratePlan} disabled={isLoading || !income} className="w-full text-base">
                            {isLoading ? <LoadingSpinner /> : 'Create My Budget'}
                        </Button>
                        {error && <p className="text-red-500 mt-2 text-sm text-center">{error}</p>}
                    </div>
                </div>
            </Card>

            {budgetPlan && (
                 <Card>
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Your Budget Plan</h2>
                        <p className="text-slate-600 dark:text-slate-400 mb-6">{budgetPlan.summary}</p>

                        <h3 className="text-xl font-semibold mb-2 text-slate-700 dark:text-slate-200">Budget Breakdown</h3>
                        <div className="relative w-full h-80">
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie 
                                        data={budgetPlan.breakdown} 
                                        dataKey="amount" 
                                        nameKey="category" 
                                        cx="50%" 
                                        cy="50%" 
                                        innerRadius={80}
                                        outerRadius={110} 
                                        fill="#8884d8"
                                        paddingAngle={2}
                                        activeIndex={activeIndex}
                                        activeShape={renderActiveShape}
                                        onMouseEnter={onPieEnter}
                                    >
                                         {budgetPlan.breakdown.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="focus:outline-none"/>)}
                                    </Pie>
                                    <Legend 
                                        iconSize={10} 
                                        wrapperStyle={{
                                            fontSize: '0.875rem', 
                                            color: theme === 'dark' ? '#94a3b8' : '#475569'
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                             <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                 <span className="text-slate-500 dark:text-slate-400 text-sm">Total Income</span>
                                 <span className="text-3xl font-bold text-slate-800 dark:text-slate-100">${parseFloat(income).toFixed(2)}</span>
                             </div>
                        </div>

                        <h3 className="text-xl font-semibold mt-6 mb-3 text-slate-700 dark:text-slate-200">Savings Tips</h3>
                        <ul className="list-inside space-y-2 text-slate-600 dark:text-slate-400">
                            {budgetPlan.tips.map((tip, index) => 
                                <li key={index} className="flex items-start">
                                    <span className="text-primary mr-2 mt-1">✓</span>
                                    <span>{tip}</span>
                                </li>
                            )}
                        </ul>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default BudgetPlanner;