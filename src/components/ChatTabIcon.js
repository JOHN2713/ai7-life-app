import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUnreadMessages } from '../contexts/UnreadMessagesContext';
import { COLORS } from '../constants/colors';

const ChatTabIcon = ({ focused, color, size }) => {
  const { totalUnread } = useUnreadMessages();

  return (
    <View style={styles.container}>
      <Ionicons name="chatbubbles" size={24} color={color} />
      {totalUnread > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {totalUnread > 99 ? '99+' : totalUnread}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: 24,
    height: 24,
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -12,
    backgroundColor: COLORS.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '700',
  },
});

export default ChatTabIcon;
