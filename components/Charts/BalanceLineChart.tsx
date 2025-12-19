import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { VictoryLine, VictoryChart, VictoryAxis, VictoryTheme } from 'victory-native';
import { Transaction } from '../../types';

interface BalanceLineChartProps {
  transactions: Transaction[];
  currentBalance: number;
}

export default function BalanceLineChart({ transactions, currentBalance }: BalanceLineChartProps) {
  if (transactions.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>📈 Nenhuma transação para exibir</Text>
      </View>
    );
  }

  const recentTransactions = [...transactions].reverse().slice(-10);
  
  let balance = currentBalance;
  const balances: Array<{ x: number; y: number }> = [];
  
  for (let i = transactions.length - 1; i >= Math.max(0, transactions.length - 10); i--) {
    const t = transactions[i];
    const delta = t.tipo === 'entrada' ? -t.valor : t.valor;
    balance += delta;
    balances.unshift({ x: balances.length + 1, y: balance });
  }
  
  balances.push({ x: balances.length + 1, y: currentBalance });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Evolução do Saldo</Text>
      <Text style={styles.subtitle}>Últimas 10 transações</Text>
      
      <VictoryChart
        width={Dimensions.get('window').width - 32}
        height={250}
        theme={VictoryTheme.material}
        padding={{ top: 20, bottom: 40, left: 50, right: 20 }}
      >
        <VictoryAxis
          style={{
            axis: { stroke: '#374151' },
            tickLabels: { fill: '#9ca3af', fontSize: 10 },
            grid: { stroke: '#374151', strokeWidth: 0.5 },
          }}
        />
        <VictoryAxis
          dependentAxis
          style={{
            axis: { stroke: '#374151' },
            tickLabels: { fill: '#9ca3af', fontSize: 10 },
            grid: { stroke: '#374151', strokeWidth: 0.5 },
          }}
          tickFormat={(t) => `R$ ${t.toFixed(0)}`}
        />
        <VictoryLine
          data={balances}
          style={{
            data: { 
              stroke: '#3b82f6', 
              strokeWidth: 3 
            },
          }}
          interpolation="monotoneX"
        />
      </VictoryChart>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1f2937',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  emptyContainer: {
    backgroundColor: '#1f2937',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
  },
});