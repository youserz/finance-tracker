import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryGroup, VictoryLegend, VictoryTheme } from 'victory-native';

interface IncomeExpenseChartProps {
  data: { mes: string; entradas: number; saidas: number }[];
}

export default function IncomeExpenseChart({ data }: IncomeExpenseChartProps) {
  if (data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>📊 Nenhum dado mensal disponível</Text>
      </View>
    );
  }

  const chartData = data.map((item) => {
    const [year, month] = item.mes.split('-');
    return {
      x: `${month}/${year.slice(2)}`,
      entradas: item.entradas,
      saidas: item.saidas,
    };
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Entradas vs Saídas</Text>
      <Text style={styles.subtitle}>Últimos 6 meses</Text>
      
      <VictoryChart
        width={Dimensions.get('window').width - 32}
        height={280}
        theme={VictoryTheme.material}
        domainPadding={{ x: 20 }}
        padding={{ top: 50, bottom: 50, left: 60, right: 20 }}
      >
        <VictoryLegend
          x={(Dimensions.get('window').width - 32) / 2 - 80}
          y={10}
          orientation="horizontal"
          gutter={20}
          data={[
            { name: 'Entradas', symbol: { fill: '#10b981' } },
            { name: 'Saídas', symbol: { fill: '#ef4444' } },
          ]}
          style={{
            labels: { fill: '#9ca3af', fontSize: 12 },
          }}
        />
        
        <VictoryAxis
          style={{
            axis: { stroke: '#374151' },
            tickLabels: { 
              fill: '#9ca3af', 
              fontSize: 9,
              angle: -45,
              textAnchor: 'end',
            },
            grid: { stroke: 'none' },
          }}
        />
        <VictoryAxis
          dependentAxis
          style={{
            axis: { stroke: '#374151' },
            tickLabels: { fill: '#9ca3af', fontSize: 10 },
            grid: { stroke: '#374151', strokeWidth: 0.5 },
          }}
          tickFormat={(t) => `${t.toFixed(0)}`}
        />
        
        <VictoryGroup 
          offset={12} 
          colorScale={['#10b981', '#ef4444']}
        >
          <VictoryBar
            data={chartData}
            x="x"
            y="entradas"
          />
          <VictoryBar
            data={chartData}
            x="x"
            y="saidas"
          />
        </VictoryGroup>
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