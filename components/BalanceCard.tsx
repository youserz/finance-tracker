import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';

interface BalanceCardProps {
  balance: number;
  onBalanceUpdate: (newBalance: number) => void;
}

export default function BalanceCard({ balance, onBalanceUpdate }: BalanceCardProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [tempBalance, setTempBalance] = React.useState(balance.toFixed(2));

  const handlePress = () => {
    Alert.alert(
      'Ajustar Saldo',
      'Deseja editar o saldo manualmente?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Editar',
          onPress: () => {
            setTempBalance(balance.toFixed(2));
            setIsEditing(true);
          }
        },
      ]
    );
  };

  const handleSave = () => {
    const newBalance = parseFloat(tempBalance.replace(',', '.'));
    if (!isNaN(newBalance)) {
      onBalanceUpdate(newBalance);
      setIsEditing(false);
    } else {
      Alert.alert('Erro', 'Valor inválido');
    }
  };

  const balanceColor = balance >= 0 ? '#10b981' : '#ef4444';

  return (
    <TouchableOpacity 
      style={styles.container} 
      onLongPress={handlePress}
      activeOpacity={0.8}
    >
      <Text style={styles.label}>Saldo Atual</Text>
      {isEditing ? (
        <View style={styles.editContainer}>
          <Text style={styles.currency}>R$</Text>
          <TextInput
            style={styles.input}
            value={tempBalance}
            onChangeText={setTempBalance}
            keyboardType="decimal-pad"
            autoFocus
            selectTextOnFocus
          />
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveText}>✓</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsEditing(false)} style={styles.cancelButton}>
            <Text style={styles.cancelText}>✕</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={[styles.balance, { color: balanceColor }]}>
          R$ {balance.toFixed(2).replace('.', ',')}
        </Text>
      )}
      <Text style={styles.hint}>Pressione e segure para editar</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1f2937',
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 16,
    marginVertical: 8,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    color: '#9ca3af',
    marginBottom: 8,
  },
  balance: {
    fontSize: 42,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  hint: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  editContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  currency: {
    fontSize: 32,
    color: '#fff',
    marginRight: 8,
  },
  input: {
    fontSize: 32,
    color: '#fff',
    borderBottomWidth: 2,
    borderBottomColor: '#3b82f6',
    minWidth: 150,
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: '#10b981',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  saveText: {
    color: '#fff',
    fontSize: 20,
  },
  cancelButton: {
    backgroundColor: '#ef4444',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  cancelText: {
    color: '#fff',
    fontSize: 20,
  },
});