import apiClient from './client';

interface StartResetPayload {
  startedAt: string;
  selectedDurationMinutes: number;
  headphoneConnected: boolean;
  headphoneAction?: 'skip' | 'connect';
}

interface EndResetPayload {
  endedAt: string;
  status: 'completed' | 'interrupted';
  endedBy: 'user' | 'auto';
  actualDurationSeconds: number;
}

export const startResetSession = async (payload: StartResetPayload) => {
  const response = await apiClient.post('/reset-sessions', payload);
  return response.data.data;
};

export const endResetSession = async (
  sessionId: string,
  payload: EndResetPayload
) => {
  const response = await apiClient.put(
    `/reset-sessions/${sessionId}`,
    payload
  );
  return response.data.data;
};