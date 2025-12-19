import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { TransactionParser } from '../services/transactionParser';

interface TransactionInputProps {
  onSubmit: (text: string) => Promise<void>;
}

export default function TransactionInput({ onSubmit }: TransactionInputProps) {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    const validation = TransactionParser.validateInput(text);
    
    if (!validation.valid) {
      Alert.alert('Erro', validation.error);
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit(text);
      setText('');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível registrar a transação');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite: lazer 50, salário 2500..."
          placeholderTextColor="#6b7280"
          value={text}
          onChangeText={setText}
          onSubmitEditing={handleSubmit}
          editable={!isLoading}
        />
        <TouchableOpacity 
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? '...' : '→'}
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.hint}>
        💡 Exemplos: "mercado 150", "uber 25,50", "salário 3000"
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#111827',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1f2937',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    paddingVertical: 14,
  },
  button: {
    backgroundColor: '#3b82f6',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  buttonDisabled: {
    backgroundColor: '#4b5563',
  },
  buttonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  hint: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
  },
});