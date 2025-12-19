export type TransactionType = 'entrada' | 'saida';

export interface Transaction {
  id: string;
  tipo: TransactionType;
  categoria: string;
  valor: number;
  data_hora: string;
  descricao_original: string;
}

export interface Category {
  id: string;
  nome: string;
}

export interface Account {
  saldo_atual: number;
}

export interface ParsedTransaction {
  valor: number;
  categoria: string;
  tipo: TransactionType;
  texto: string;
}