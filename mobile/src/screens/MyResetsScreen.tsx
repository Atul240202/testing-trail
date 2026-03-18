/**
 * My Resets Screen
 *
 * Displays the user's reset session history with weekly self-care count
 * and a list of completed/interrupted sessions sorted by most recent.
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../theme/colors';
import apiClient from '../api/client';
import BottomNav from '../components/BottomNav';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ResetSession {
  _id: string;
  startedAt: string;
  endedAt: string | null;
  selectedDurationMinutes: number;
  actualDurationSeconds: number | null;
  status: 'started' | 'completed' | 'interrupted';
  endedBy: 'user' | 'auto' | null;
  headphoneConnected: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getWeekStart = (): Date => {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday
  const monday = new Date(now);
  monday.setDate(diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
};

const formatDate = (iso: string): string => {
  const date = new Date(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const formatDuration = (session: ResetSession): string => {
  if (session.actualDurationSeconds != null) {
    const mins = Math.round(session.actualDurationSeconds / 60);
    return `${mins} min`;
  }
  return `${session.selectedDurationMinutes} min`;
};

// ─── Session Row ──────────────────────────────────────────────────────────────

const SessionRow = ({ item }: { item: ResetSession }) => {
  const isCompleted = item.status === 'completed';

  return (
    <View style={styles.sessionRow}>
      <View style={[styles.sessionIcon, isCompleted ? styles.iconCompleted : styles.iconInterrupted]}>
        <MaterialCommunityIcons
          name={isCompleted ? 'check' : 'close'}
          size={16}
          color={colors.white}
        />
      </View>
      <View style={styles.sessionInfo}>
        <Text style={styles.sessionTitle}>
          {isCompleted ? 'Reset completed' : 'Reset interrupted'}
        </Text>
        <Text style={styles.sessionDate}>{formatDate(item.startedAt)}</Text>
      </View>
      <Text style={styles.sessionDuration}>{formatDuration(item)}</Text>
    </View>
  );
};

// ─── Screen ───────────────────────────────────────────────────────────────────

const MyResetsScreen = ({ navigation }: any) => {
  const [sessions, setSessions] = useState<ResetSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    try {
      setError(null);
      const response = await apiClient.get('/reset-sessions', {
        params: { limit: 50, offset: 0 },
      });

      const fetchedSessions = response?.data?.data?.sessions || [];

      const sorted = [...fetchedSessions].sort(
        (a: ResetSession, b: ResetSession) =>
          new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
      );

      setSessions(sorted);
    } catch (err) {
      setError('Could not load your resets.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchHistory();
  };

  // Count sessions this week
  const weekStart = getWeekStart();
  const weekCount = sessions.filter(
    (s) => new Date(s.startedAt) >= weekStart
  ).length;

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Resets</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primaryPurple} />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={fetchHistory} style={styles.retryBtn}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={sessions}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primaryPurple}
            />
          }
          ListHeaderComponent={
            <>
              {/* Weekly summary card */}
              <View style={styles.summaryCard}>
                <Text style={styles.summaryText}>
                  You've taken care of yourself{' '}
                  <Text style={styles.summaryCount}>{weekCount}</Text>
                  {weekCount === 1 ? ' time' : ' times'} this week.
                </Text>
              </View>

              {sessions.length === 0 && (
                <View style={styles.emptyState}>
                  <MaterialCommunityIcons
                    name="pause-circle-outline"
                    size={48}
                    color="#CCCCCC"
                  />
                  <Text style={styles.emptyTitle}>No resets yet</Text>
                  <Text style={styles.emptySubtitle}>
                    Start your first reset from the Home screen.
                  </Text>
                </View>
              )}
            </>
          }
          renderItem={({ item }) => <SessionRow item={item} />}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}

      {/* R196: extracted into reusable BottomNav component */}
      <BottomNav navigation={navigation} activeTab="MyResets" />
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    backgroundColor: colors.white,
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 20 : 64,
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter_28pt-SemiBold',
    color: colors.textDark,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
  summaryCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 18,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryText: {
    fontSize: 16,
    fontFamily: 'Inter_28pt-Regular',
    color: colors.textDark,
    lineHeight: 24,
  },
  summaryCount: {
    fontFamily: 'Inter_28pt-SemiBold',
    color: colors.primaryPurple,
  },
  sessionRow: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  sessionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  iconCompleted: {
    backgroundColor: '#34C759',
  },
  iconInterrupted: {
    backgroundColor: '#FF9500',
  },
  sessionInfo: {
    flex: 1,
  },
  sessionTitle: {
    fontSize: 15,
    fontFamily: 'Inter_28pt-SemiBold',
    color: colors.textDark,
    marginBottom: 2,
  },
  sessionDate: {
    fontSize: 13,
    fontFamily: 'Inter_28pt-Regular',
    color: colors.textGrey,
  },
  sessionDuration: {
    fontSize: 14,
    fontFamily: 'Inter_28pt-Regular',
    color: colors.textGrey,
    marginLeft: 8,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E5E5EA',
    marginLeft: 62,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 64,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Inter_28pt-SemiBold',
    color: colors.textDark,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: 'Inter_28pt-Regular',
    color: colors.textGrey,
    textAlign: 'center',
    lineHeight: 20,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 15,
    fontFamily: 'Inter_28pt-Regular',
    color: colors.textGrey,
    marginBottom: 12,
  },
  retryBtn: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: colors.primaryPurple,
    borderRadius: 20,
  },
  retryText: {
    fontSize: 14,
    fontFamily: 'Inter_28pt-SemiBold',
    color: colors.white,
  },
});

export default MyResetsScreen;