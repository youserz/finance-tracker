import * as SQLite from 'expo-sqlite';
import { Transaction, Category, Account } from '../types';
import { DEFAULT_CATEGORIES } from '../constants/categories';

class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;

  async init() {
    this.db = await SQLite.openDatabaseAsync('finance_tracker.db');
    await this.createTables();
    await this.initializeDefaultData();
  }

  private async createTables() {
    if (!this.db) return;

    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY,
        tipo TEXT NOT NULL,
        categoria TEXT NOT NULL,
        valor REAL NOT NULL,
        data_hora TEXT NOT NULL,
        descricao_original TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        nome TEXT UNIQUE NOT NULL
      );

      CREATE TABLE IF NOT EXISTS account (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        saldo_atual REAL NOT NULL DEFAULT 0
      );

      CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(data_hora DESC);
      CREATE INDEX IF NOT EXISTS idx_transactions_tipo ON transactions(tipo);
    `);
  }

  private async initializeDefaultData() {
    if (!this.db) return;

    // Verificar se já existe conta
    const account = await this.db.getFirstAsync<Account>(
      'SELECT * FROM account WHERE id = 1'
    );

    if (!account) {
      await this.db.runAsync(
        'INSERT INTO account (id, saldo_atual) VALUES (1, 0)'
      );
    }

    // Adicionar categorias padrão
    for (const categoria of DEFAULT_CATEGORIES) {
      await this.db.runAsync(
        'INSERT OR IGNORE INTO categories (id, nome) VALUES (?, ?)',
        [this.generateId(), categoria]
      );
    }
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  async addTransaction(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
    if (!this.db) throw new Error('Database not initialized');

    const id = this.generateId();
    const newTransaction: Transaction = { id, ...transaction };

    await this.db.runAsync(
      `INSERT INTO transactions (id, tipo, categoria, valor, data_hora, descricao_original)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, transaction.tipo, transaction.categoria, transaction.valor, 
       transaction.data_hora, transaction.descricao_original]
    );

    // Adicionar categoria se não existir
    await this.db.runAsync(
      'INSERT OR IGNORE INTO categories (id, nome) VALUES (?, ?)',
      [this.generateId(), transaction.categoria]
    );

    // Atualizar saldo
    const delta = transaction.tipo === 'entrada' ? transaction.valor : -transaction.valor;
    await this.db.runAsync(
      'UPDATE account SET saldo_atual = saldo_atual + ? WHERE id = 1',
      [delta]
    );

    return newTransaction;
  }

  async getTransactions(limit?: number): Promise<Transaction[]> {
    if (!this.db) return [];

    const query = limit 
      ? 'SELECT * FROM transactions ORDER BY data_hora DESC LIMIT ?'
      : 'SELECT * FROM transactions ORDER BY data_hora DESC';

    const rows = limit
      ? await this.db.getAllAsync<Transaction>(query, [limit])
      : await this.db.getAllAsync<Transaction>(query);

    return rows;
  }

  async getBalance(): Promise<number> {
    if (!this.db) return 0;

    const result = await this.db.getFirstAsync<Account>(
      'SELECT saldo_atual FROM account WHERE id = 1'
    );

    return result?.saldo_atual || 0;
  }

  async updateBalance(newBalance: number): Promise<void> {
    if (!this.db) return;

    await this.db.runAsync(
      'UPDATE account SET saldo_atual = ? WHERE id = 1',
      [newBalance]
    );
  }

  async getCategories(): Promise<Category[]> {
    if (!this.db) return [];

    const rows = await this.db.getAllAsync<Category>(
      'SELECT * FROM categories ORDER BY nome'
    );

    return rows;
  }

  async getExpensesByCategory(): Promise<{ categoria: string; total: number }[]> {
    if (!this.db) return [];

    const rows = await this.db.getAllAsync<{ categoria: string; total: number }>(
      `SELECT categoria, SUM(valor) as total 
       FROM transactions 
       WHERE tipo = 'saida' 
       GROUP BY categoria 
       ORDER BY total DESC`
    );

    return rows;
  }

  async getMonthlyIncomeExpense(): Promise<{ 
    mes: string; 
    entradas: number; 
    saidas: number 
  }[]> {
    if (!this.db) return [];

    const rows = await this.db.getAllAsync<{ 
      mes: string; 
      entradas: number; 
      saidas: number 
    }>(
      `SELECT 
        strftime('%Y-%m', data_hora) as mes,
        SUM(CASE WHEN tipo = 'entrada' THEN valor ELSE 0 END) as entradas,
        SUM(CASE WHEN tipo = 'saida' THEN valor ELSE 0 END) as saidas
       FROM transactions
       GROUP BY mes
       ORDER BY mes DESC
       LIMIT 6`
    );

    return rows.reverse();
  }

  async deleteTransaction(id: string): Promise<void> {
    if (!this.db) return;

    // Obter transação antes de deletar para ajustar saldo
    const transaction = await this.db.getFirstAsync<Transaction>(
      'SELECT * FROM transactions WHERE id = ?',
      [id]
    );

    if (transaction) {
      await this.db.runAsync('DELETE FROM transactions WHERE id = ?', [id]);
      
      // Ajustar saldo
      const delta = transaction.tipo === 'entrada' ? -transaction.valor : transaction.valor;
      await this.db.runAsync(
        'UPDATE account SET saldo_atual = saldo_atual + ? WHERE id = 1',
        [delta]
      );
    }
  }

  async recalculateBalance(): Promise<void> {
    if (!this.db) return;

    const result = await this.db.getFirstAsync<{ balance: number }>(
      `SELECT 
        SUM(CASE WHEN tipo = 'entrada' THEN valor ELSE -valor END) as balance
       FROM transactions`
    );

    const newBalance = result?.balance || 0;
    await this.updateBalance(newBalance);
  }
}

export const db = new DatabaseService();