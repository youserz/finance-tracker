import React, { useEffect, useState } from 'react';
import { StyleSheet, View, RefreshControl, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BalanceCard from '@/components/BalanceCard';
import TransactionInput from '@/components/TransactionInput';
import TransactionList from '@/components/TransactionList';
import { db } from '@/services/database';
import { TransactionParser } from '@/services/transactionParser';
import { Transaction } from '@/types';

export default function HomeScreen() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      await db.init();
      await loadData();
    } catch (error) {
      console.error('Error initializing app:', error);
    }
  };

  const loadData = async () => {
    try {
      const [currentBalance, recentTransactions] = await Promise.all([
        db.getBalance(),
        db.getTransactions(20),
      ]);
      setBalance(currentBalance);
      setTransactions(recentTransactions);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleSubmit = async (text: string) => {
    const parsed = TransactionParser.parse(text);
    if (!parsed) return;

    const transaction = {
      tipo: parsed.tipo,
      categoria: parsed.categoria,
      valor: parsed.valor,
      data_hora: new Date().toISOString(),
      descricao_original: parsed.texto,
    };

    await db.addTransaction(transaction);
    await loadData();
  };

  const handleDelete = async (id: string) => {
    await db.deleteTransaction(id);
    await loadData();
  };

  const handleBalanceUpdate = async (newBalance: number) => {
    await db.updateBalance(newBalance);
    await db.recalculateBalance();
    await loadData();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <BalanceCard balance={balance} onBalanceUpdate={handleBalanceUpdate} />
        <View style={styles.listContainer}>
          <TransactionList transactions={transactions} onDelete={handleDelete} />
        </View>
      </ScrollView>
      <TransactionInput onSubmit={handleSubmit} />
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
  listContainer: {
    flex: 1,
    minHeight: 400,
  },
});