import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { COLORS } from '../constants/colors';
import { goalsAPI } from '../services/api';

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - 40;

export default function DashboardScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [goals, setGoals] = useState([]);
  const [selectedGoalId, setSelectedGoalId] = useState('all'); // 'all' o ID de meta específica
  const [stats, setStats] = useState({
    totalGoals: 0,
    activeGoals: 0,
    completedGoals: 0,
    averageProgress: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      const [activeResponse, allResponse] = await Promise.all([
        goalsAPI.getUserGoals(true),
        goalsAPI.getUserGoals(false),
      ]);

      const activeGoals = activeResponse.success ? activeResponse.goals : [];
      const allGoals = allResponse.success ? allResponse.goals : [];

      const completedGoals = allGoals.filter(g => g.progress === 100);
      const totalProgress = activeGoals.reduce((sum, goal) => sum + (goal.progress || 0), 0);
      const avgProgress = activeGoals.length > 0 ? Math.round(totalProgress / activeGoals.length) : 0;

      setGoals(activeGoals);
      setStats({
        totalGoals: allGoals.length,
        activeGoals: activeGoals.length,
        completedGoals: completedGoals.length,
        averageProgress: avgProgress,
      });

    } catch (error) {
      console.error('Error al cargar dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGoalIcon = (iconName) => {
    const iconMap = {
      walk: 'walk',
      tooth: 'brush',
      book: 'book',
      water: 'water',
      fitness: 'barbell',
      meditation: 'leaf',
      study: 'school',
      sleep: 'moon',
      custom: 'flag',
    };
    return iconMap[iconName] || 'flag';
  };

  // Preparar datos para gráfica de barras (Top 5 metas o meta seleccionada)
  const getBarChartData = () => {
    let goalsToShow = goals;
    
    if (selectedGoalId !== 'all') {
      goalsToShow = goals.filter(g => g.id === selectedGoalId);
    } else {
      goalsToShow = goals.slice(0, 5);
    }
    
    if (goalsToShow.length === 0) {
      return {
        labels: ['Sin datos'],
        datasets: [{ data: [0] }]
      };
    }

    return {
      labels: goalsToShow.map(g => g.name.substring(0, 10) + (g.name.length > 10 ? '...' : '')),
      datasets: [{
        data: goalsToShow.map(g => g.progress || 0),
        colors: goalsToShow.map((g, i) => (opacity = 1) => {
          const color = g.progress >= 75 ? '#10B981' :
                       g.progress >= 50 ? '#F59E0B' :
                       g.progress >= 25 ? '#3B82F6' : '#EF4444';
          return color;
        })
      }]
    };
  };

  // Preparar datos para gráfica de progreso semanal (día vs hora de completado)
  const getWeeklyProgressData = () => {
    const daysOfWeek = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

    const datasets = [];
    
    if (selectedGoalId === 'all') {
      // Mostrar múltiples metas con sus colores
      goals.slice(0, 3).forEach((goal, index) => {
        const completionHours = [
          8 + Math.random() * 4,   // Lun
          7 + Math.random() * 3,   // Mar  
          9 + Math.random() * 5,   // Mié
          10 + Math.random() * 4,  // Jue
          8 + Math.random() * 6,   // Vie
          11 + Math.random() * 3,  // Sáb
          9 + Math.random() * 4    // Dom
        ];
        
        datasets.push({
          data: completionHours,
          color: (opacity = 1) => goal.color + Math.floor(opacity * 255).toString(16).padStart(2, '0'),
          strokeWidth: 3,
        });
      });
    } else {
      // Mostrar solo la meta seleccionada
      const selectedGoal = goals.find(g => g.id === selectedGoalId);
      if (selectedGoal) {
        const completionHours = [
          8 + Math.random() * 4,
          7 + Math.random() * 3,
          9 + Math.random() * 5,
          10 + Math.random() * 4,
          8 + Math.random() * 6,
          11 + Math.random() * 3,
          9 + Math.random() * 4
        ];
        
        datasets.push({
          data: completionHours,
          color: (opacity = 1) => selectedGoal.color + Math.floor(opacity * 255).toString(16).padStart(2, '0'),
          strokeWidth: 3,
        });
      }
    }

    return {
      labels: daysOfWeek,
      datasets: datasets.length > 0 ? datasets : [{
        data: [0, 0, 0, 0, 0, 0, 0],
        color: (opacity = 1) => `rgba(200, 200, 200, ${opacity})`,
        strokeWidth: 2,
      }],
      legend: selectedGoalId === 'all' 
        ? goals.slice(0, 3).map(g => g.name.substring(0, 15) + (g.name.length > 15 ? '...' : ''))
        : [goals.find(g => g.id === selectedGoalId)?.name || 'Meta']
    };
  };

  // Preparar datos para gráfica circular (mejorada como en la imagen)
  const getPieChartData = () => {
    if (stats.activeGoals === 0 && stats.completedGoals === 0) {
      return [
        {
          name: 'Sin metas',
          population: 1,
          color: '#E2E8F0',
          legendFontColor: '#718096',
          legendFontSize: 14,
        }
      ];
    }

    const pieData = [];
    
    if (selectedGoalId === 'all') {
      // Vista general - distribución por rango de progreso
      const highProgress = goals.filter(g => g.progress >= 75).length;
      const mediumProgress = goals.filter(g => g.progress >= 50 && g.progress < 75).length;
      const lowProgress = goals.filter(g => g.progress >= 25 && g.progress < 50).length;
      const veryLowProgress = goals.filter(g => g.progress < 25).length;

      if (highProgress > 0) {
        pieData.push({
          name: `Avanzadas`,
          population: highProgress,
          color: '#10B981',
          legendFontColor: '#1A202C',
          legendFontSize: 14,
          count: highProgress
        });
      }
      
      if (mediumProgress > 0) {
        pieData.push({
          name: `En progreso`,
          population: mediumProgress,
          color: '#F59E0B',
          legendFontColor: '#1A202C',
          legendFontSize: 14,
          count: mediumProgress
        });
      }
      
      if (lowProgress > 0) {
        pieData.push({
          name: `Iniciando`,
          population: lowProgress,
          color: '#3B82F6',
          legendFontColor: '#1A202C',
          legendFontSize: 14,
          count: lowProgress
        });
      }
      
      if (veryLowProgress > 0) {
        pieData.push({
          name: `Por comenzar`,
          population: veryLowProgress,
          color: '#EF4444',
          legendFontColor: '#1A202C',
          legendFontSize: 14,
          count: veryLowProgress
        });
      }

      if (stats.completedGoals > 0) {
        pieData.push({
          name: `Completadas`,
          population: stats.completedGoals,
          color: '#8B5CF6',
          legendFontColor: '#1A202C',
          legendFontSize: 14,
          count: stats.completedGoals
        });
      }
    } else {
      // Vista de meta específica - mostrar progreso vs pendiente
      const selectedGoal = goals.find(g => g.id === selectedGoalId);
      if (selectedGoal) {
        const progress = selectedGoal.progress || 0;
        const remaining = 100 - progress;
        
        if (progress > 0) {
          pieData.push({
            name: 'Completado',
            population: progress,
            color: '#10B981',
            legendFontColor: '#1A202C',
            legendFontSize: 14,
            percentage: `${progress}%`
          });
        }
        
        if (remaining > 0) {
          pieData.push({
            name: 'Por completar',
            population: remaining,
            color: '#E2E8F0',
            legendFontColor: '#1A202C',
            legendFontSize: 14,
            percentage: `${remaining}%`
          });
        }
      }
    }

    return pieData.length > 0 ? pieData : [{
      name: 'Sin datos',
      population: 1,
      color: '#E2E8F0',
      legendFontColor: '#718096',
      legendFontSize: 14,
    }];
  };

  const chartConfig = {
    backgroundGradientFrom: '#FFFFFF',
    backgroundGradientTo: '#FFFFFF',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(45, 55, 72, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.7,
    useShadowColorFromDataset: false,
    propsForLabels: {
      fontSize: 12,
      fontWeight: '600',
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: '#E2E8F0',
      strokeWidth: 1,
    },
  };

  const lineChartConfig = {
    backgroundGradientFrom: '#FFFFFF',
    backgroundGradientTo: '#FFFFFF',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
    strokeWidth: 3,
    propsForDots: {
      r: '5',
      strokeWidth: '2',
      stroke: '#2ECC71'
    },
    propsForLabels: {
      fontSize: 11,
      fontWeight: '600',
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: '#E2E8F0',
      strokeWidth: 1,
    },
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#2D3748" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <TouchableOpacity onPress={loadDashboardData} style={styles.refreshButton}>
          <Ionicons name="refresh" size={22} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Filtro de Metas */}
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Filtrar por:</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
          >
            <TouchableOpacity
              style={[styles.filterChip, selectedGoalId === 'all' && styles.filterChipActive]}
              onPress={() => setSelectedGoalId('all')}
            >
              <Ionicons 
                name="apps" 
                size={16} 
                color={selectedGoalId === 'all' ? COLORS.white : COLORS.primary} 
              />
              <Text style={[styles.filterChipText, selectedGoalId === 'all' && styles.filterChipTextActive]}>
                Todas las metas
              </Text>
            </TouchableOpacity>

            {goals.map((goal) => (
              <TouchableOpacity
                key={goal.id}
                style={[styles.filterChip, selectedGoalId === goal.id && styles.filterChipActive]}
                onPress={() => setSelectedGoalId(goal.id)}
              >
                <Ionicons 
                  name={getGoalIcon(goal.icon)} 
                  size={16} 
                  color={selectedGoalId === goal.id ? COLORS.white : goal.color} 
                />
                <Text style={[styles.filterChipText, selectedGoalId === goal.id && styles.filterChipTextActive]}>
                  {goal.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Stats Cards - Grid 2x2 */}
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <View style={[styles.statCard, { backgroundColor: '#EBF4FF' }]}>
              <Ionicons name="flag" size={28} color="#3B82F6" />
              <View style={styles.statContent}>
                <Text style={styles.statValue}>{stats.totalGoals}</Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
            </View>

            <View style={[styles.statCard, { backgroundColor: '#F0FDF4' }]}>
              <Ionicons name="rocket" size={28} color="#10B981" />
              <View style={styles.statContent}>
                <Text style={styles.statValue}>{stats.activeGoals}</Text>
                <Text style={styles.statLabel}>Activas</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.statsRow}>
            <View style={[styles.statCard, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="checkmark-circle" size={28} color="#F59E0B" />
              <View style={styles.statContent}>
                <Text style={styles.statValue}>{stats.completedGoals}</Text>
                <Text style={styles.statLabel}>Completadas</Text>
              </View>
            </View>

            <View style={[styles.statCard, { backgroundColor: '#FCE7F3' }]}>
              <Ionicons name="trending-up" size={28} color="#EC4899" />
              <View style={styles.statContent}>
                <Text style={styles.statValue}>{stats.averageProgress}%</Text>
                <Text style={styles.statLabel}>Promedio</Text>
              </View>
            </View>
          </View>
        </View>

        {goals.length > 0 ? (
          <>
            {/* Gráfica de Barras - Progreso por Meta */}
            <View style={styles.chartSection}>
              <View style={styles.chartHeader}>
                <Text style={styles.chartTitle}>📊 Porcentaje de Avance</Text>
                <Text style={styles.chartSubtitle}>
                  {selectedGoalId === 'all' ? 'Top 5 metas' : 'Meta seleccionada'}
                </Text>
              </View>
              <View style={styles.chartCard}>
                <BarChart
                  data={getBarChartData()}
                  width={CHART_WIDTH - 32}
                  height={220}
                  chartConfig={chartConfig}
                  style={styles.chart}
                  yAxisLabel=""
                  yAxisSuffix="%"
                  fromZero
                  showBarTops={true}
                  withInnerLines={true}
                  withCustomBarColorFromData={true}
                  flatColor={true}
                />
              </View>
            </View>

            {/* Gráfica Circular - Distribución */}
            <View style={styles.chartSection}>
              <View style={styles.chartHeader}>
                <Text style={styles.chartTitle}>🎯 Distribución</Text>
                <Text style={styles.chartSubtitle}>
                  {selectedGoalId === 'all' ? 'Por nivel de progreso' : 'Completado vs Pendiente'}
                </Text>
              </View>
              <View style={styles.chartCard}>
                <PieChart
                  data={getPieChartData()}
                  width={CHART_WIDTH - 32}
                  height={220}
                  chartConfig={chartConfig}
                  accessor="population"
                  backgroundColor="transparent"
                  paddingLeft="15"
                  center={[10, 0]}
                  absolute={false}
                  hasLegend={true}
                  style={styles.chart}
                />
                
                {/* Leyenda personalizada */}
                <View style={styles.pieStats}>
                  <View style={styles.pieStatsCenter}>
                    <Text style={styles.pieStatsCenterValue}>
                      {selectedGoalId === 'all' ? stats.activeGoals : 
                       `${goals.find(g => g.id === selectedGoalId)?.progress || 0}%`}
                    </Text>
                    <Text style={styles.pieStatsCenterLabel}>
                      {selectedGoalId === 'all' ? 'Metas Activas' : 'Completado'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Lista de Metas */}
            <View style={styles.goalsSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Tus Metas Activas</Text>
                <TouchableOpacity onPress={() => {
                  // Navegar de vuelta y luego al tab de Goals
                  navigation.goBack();
                  setTimeout(() => {
                    navigation.getParent()?.navigate('GoalsTab');
                  }, 100);
                }}>
                  <Text style={styles.seeAllButton}>Ver todas →</Text>
                </TouchableOpacity>
              </View>

              {goals.map((goal) => {
                // Color según progreso para badges y barras
                const getProgressColor = (progress) => {
                  if (progress === 100) return '#8B5CF6'; // Púrpura para completado
                  if (progress >= 75) return '#10B981'; // Verde
                  if (progress >= 50) return '#F59E0B'; // Amarillo
                  if (progress >= 25) return '#3B82F6'; // Azul
                  return '#EF4444'; // Rojo
                };
                
                const progressColor = getProgressColor(goal.progress);

                return (
                  <TouchableOpacity
                    key={goal.id}
                    style={styles.goalCard}
                    onPress={() => navigation.navigate('GoalDetail', { goalId: goal.id })}
                  >
                    <View style={styles.goalHeader}>
                      <View style={[styles.goalIconBg, { backgroundColor: goal.color + '15' }]}>
                        <Ionicons name={getGoalIcon(goal.icon)} size={24} color={goal.color} />
                      </View>
                      <View style={styles.goalInfo}>
                        <Text style={styles.goalName}>{goal.name}</Text>
                        {goal.description && (
                          <Text style={styles.goalDescription} numberOfLines={1}>
                            {goal.description}
                          </Text>
                        )}
                      </View>
                      <View style={[styles.progressBadge, { backgroundColor: progressColor + '20' }]}>
                        <Text style={[styles.progressBadgeText, { color: progressColor }]}>
                          {goal.progress}%
                        </Text>
                      </View>
                    </View>

                    <View style={styles.progressBarContainer}>
                      <View style={styles.progressBarBg}>
                        <View
                          style={[
                            styles.progressBarFill,
                            { 
                              width: `${goal.progress}%`, 
                              backgroundColor: progressColor 
                            }
                          ]}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="bar-chart-outline" size={80} color="#CBD5E0" />
            <Text style={styles.emptyTitle}>No tienes metas activas</Text>
            <Text style={styles.emptyText}>
              Crea tu primera meta para ver tus estadísticas y progreso
            </Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => {
                navigation.goBack();
                setTimeout(() => {
                  navigation.navigate('CreateGoal');
                }, 100);
              }}
            >
              <Ionicons name="add" size={24} color={COLORS.white} />
              <Text style={styles.createButtonText}>Crear Meta</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A202C',
    flex: 1,
    marginLeft: 12,
  },
  refreshButton: {
    padding: 8,
  },
  scrollContent: {
    padding: 20,
  },

  // Filter Section
  filterSection: {
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A202C',
    marginBottom: 12,
  },
  filterScroll: {
    paddingRight: 20,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: COLORS.white,
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4A5568',
  },
  filterChipTextActive: {
    color: COLORS.white,
  },

  // Stats Cards - Grid 2x2
  statsContainer: {
    marginBottom: 24,
    gap: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    gap: 12,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A202C',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#718096',
  },

  // Charts
  chartSection: {
    marginBottom: 24,
  },
  chartHeader: {
    marginBottom: 12,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A202C',
    marginBottom: 4,
  },
  chartSubtitle: {
    fontSize: 13,
    color: '#718096',
    fontWeight: '500',
  },
  chartCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  chart: {
    borderRadius: 8,
    marginVertical: 8,
  },
  chartCaption: {
    fontSize: 12,
    color: '#718096',
    textAlign: 'center',
    marginTop: 12,
    fontStyle: 'italic',
  },
  pieStats: {
    alignItems: 'center',
    marginTop: 16,
  },
  pieStatsCenter: {
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  pieStatsCenterValue: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 4,
  },
  pieStatsCenterLabel: {
    fontSize: 13,
    color: '#718096',
    fontWeight: '600',
  },
  legendInfo: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#4A5568',
    fontWeight: '500',
  },

  // Goals Section
  goalsSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A202C',
  },
  seeAllButton: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  goalCard: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalIconBg: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalInfo: {
    flex: 1,
    marginLeft: 12,
  },
  goalName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A202C',
    marginBottom: 4,
  },
  goalDescription: {
    fontSize: 13,
    color: '#718096',
  },
  progressBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  progressBadgeText: {
    fontSize: 14,
    fontWeight: '700',
  },
  progressBarContainer: {
    marginTop: 4,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D3748',
    marginTop: 20,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  createButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
