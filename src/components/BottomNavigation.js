import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

export default function BottomNavigation({ activeTab, onTabPress }) {
  const tabs = [
    { name: 'home', icon: 'home', label: 'Inicio' },
    { name: 'planner', icon: 'calendar', label: 'Metas' },
    { name: 'chat', icon: 'chatbubbles', label: 'Chat' },
    { name: 'profile', icon: 'person', label: 'Perfil' },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.name}
          style={[
            styles.tab,
            activeTab === tab.name && styles.activeTab,
          ]}
          onPress={() => onTabPress(tab.name)}
        >
          <Ionicons
            name={tab.icon}
            size={24}
            color={activeTab === tab.name ? COLORS.white : COLORS.textGray}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    paddingBottom: 20,
    paddingTop: 10,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
});
