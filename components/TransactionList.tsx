import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Transaction } from '../types';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export default function TransactionList({ transactions, onDelete }: TransactionListProps) {
  const handleDelete = (transaction: Transaction) => {
    Alert.alert(
      'Excluir Transação',
      `Deseja excluir "${transaction.descricao_original}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir',
          style: 'destructive',
          onPress: () => onDelete(transaction.id)
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: Transaction }) => {
    const isIncome = item.tipo === 'entrada';
    const valueColor = isIncome ? '#10b981' : '#ef4444';
    const sign = isIncome ? '+' : '-';
    
    const date = new Date(item.data_hora);
    const formattedDate = date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    });
    const formattedTime = date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return (
      <TouchableOpacity 
        style={styles.item}
        onLongPress={() => handleDelete(item)}
        activeOpacity={0.7}
      >
        <View style={styles.itemLeft}>
          <Text style={styles.category}>{item.categoria}</Text>
          <Text style={styles.description}>{item.descricao_original}</Text>
          <Text style={styles.date}>{formattedDate} às {formattedTime}</Text>
        </View>
        <Text style={[styles.value, { color: valueColor }]}>
          {sign} R$ {item.valor.toFixed(2).replace('.', ',')}
        </Text>
      </TouchableOpacity>
    );
  };

  if (transactions.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>📝</Text>
        <Text style={styles.emptyTitle}>Nenhuma transação ainda</Text>
        <Text style={styles.emptySubtitle}>
          Digite algo como "lazer 50" para começar
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={transactions}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      style={styles.list}
      contentContainerStyle={styles.listContent}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  item: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemLeft: {
    flex: 1,
  },
  category: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#6b7280',
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
});