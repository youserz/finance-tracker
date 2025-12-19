import { ParsedTransaction } from '../types';
import { INCOME_KEYWORDS, CATEGORY_KEYWORDS, DEFAULT_CATEGORIES } from '../constants/categories';

export class TransactionParser {
  static parse(input: string): ParsedTransaction | null {
    const trimmedInput = input.trim().toLowerCase();
    
    if (!trimmedInput) {
      return null;
    }

    // Extrair valor numérico (aceita vírgula ou ponto)
    const valorMatch = trimmedInput.match(/\d+[.,]?\d*/);
    if (!valorMatch) {
      return null;
    }

    const valorStr = valorMatch[0].replace(',', '.');
    const valor = parseFloat(valorStr);

    if (isNaN(valor) || valor <= 0) {
      return null;
    }

    // Remover o valor do texto para analisar o restante
    const textoSemValor = trimmedInput.replace(valorMatch[0], '').trim();

    // Determinar tipo (entrada ou saída)
    const isIncome = INCOME_KEYWORDS.some(keyword => 
      trimmedInput.includes(keyword)
    );
    const tipo = isIncome ? 'entrada' : 'saida';

    // Determinar categoria
    let categoria = 'Outros';
    
    for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
      if (keywords.some(keyword => trimmedInput.includes(keyword))) {
        categoria = cat;
        break;
      }
    }

    // Se não encontrou categoria e não é entrada, tentar usar a primeira palavra
    if (categoria === 'Outros' && !isIncome && textoSemValor) {
      const firstWord = textoSemValor.split(' ')[0];
      if (firstWord && firstWord.length > 2) {
        // Capitalizar primeira letra
        categoria = firstWord.charAt(0).toUpperCase() + firstWord.slice(1);
      }
    }

    return {
      valor,
      categoria,
      tipo,
      texto: input.trim(),
    };
  }

  static validateInput(input: string): { valid: boolean; error?: string } {
    if (!input.trim()) {
      return { valid: false, error: 'Digite uma transação' };
    }

    const parsed = this.parse(input);
    
    if (!parsed) {
      return { 
        valid: false, 
        error: 'Não foi possível identificar o valor. Ex: "lazer 50" ou "salário 2500"' 
      };
    }

    return { valid: true };
  }
}