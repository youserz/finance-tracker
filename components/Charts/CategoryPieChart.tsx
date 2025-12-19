import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { VictoryPie } from 'victory-native';

interface CategoryPieChartProps {
  data: { categoria: string; total: number }[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

export default function CategoryPieChart({ data }: CategoryPieChartProps) {
  if (data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>📊 Nenhum gasto registrado</Text>
      </View>
    );
  }

  const total = data.reduce((sum, item) => sum + item.total, 0);

  const chartData = data.map((item, index) => ({
    x: item.categoria,
    y: item.total,
    label: `${((item.total / total) * 100).toFixed(0)}%`,
  }));

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Gastos por Categoria</Text>
      
      <View style={styles.chartContainer}>
        <VictoryPie
          data={chartData}
          width={Dimensions.get('window').width - 32}
          height={280}
          colorScale={COLORS}
          innerRadius={70}
          labelRadius={100}
          style={{
            labels: { 
              fill: '#fff', 
              fontSize: 14, 
              fontWeight: 'bold' 
            },
            data: { 
              stroke: '#1f2937', 
              strokeWidth: 3 
            },
          }}
          padding={{ top: 40, bottom: 40, left: 20, right: 20 }}
        />
      </View>

      <View style={styles.legendContainer}>
        {data.map((item, index) => (
          <View key={item.categoria} style={styles.legendItem}>
            <View 
              style={[
                styles.legendColor, 
                { backgroundColor: COLORS[index % COLORS.length] }
              ]} 
            />
            <View style={styles.legendTextContainer}>
              <Text style={styles.legendCategory}>{item.categoria}</Text>
              <Text style={styles.legendValue}>
                R$ {item.total.toFixed(2).replace('.', ',')} 
                ({((item.total / total) * 100).toFixed(1)}%)
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
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
    marginBottom: 16,
    textAlign: 'center',
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 16,
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
  legendContainer: {
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 4,
  },
  legendColor: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 12,
  },
  legendTextContainer: {
    flex: 1,
  },
  legendCategory: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  legendValue: {
    fontSize: 13,
    color: '#9ca3af',
  },
});