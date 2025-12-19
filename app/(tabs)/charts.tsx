import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import CategoryPieChart from '@/components/Charts/CategoryPieChart';
import BalanceLineChart from '@/components/Charts/BalanceLineChart';
import IncomeExpenseChart from '@/components/Charts/IncomeExpenseChart';
import { db } from '@/services/database';
import { Transaction } from '@/types';

export default function ChartsScreen() {
  const [expensesByCategory, setExpensesByCategory] = useState
    { categoria: string; total: number }[]
  >([]);
  const [monthlyData, setMonthlyData] = useState
    { mes: string; entradas: number; saidas: number }[]
  >([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadChartData();
  }, []);

  const loadChartData = async () => {
    try {
      const [expenses, monthly, allTransactions, balance] = await Promise.all([
        db.getExpensesByCategory(),
        db.getMonthlyIncomeExpense(),
        db.getTransactions(),
        db.getBalance(),
      ]);

      setExpensesByCategory(expenses);
      setMonthlyData(monthly);
      setTransactions(allTransactions);
      setCurrentBalance(balance);
    } catch (error) {
      console.error('Error loading chart data:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadChartData();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <CategoryPieChart data={expensesByCategory} />
        <BalanceLineChart transactions={transactions} currentBalance={currentBalance} />
        <IncomeExpenseChart data={monthlyData} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
});