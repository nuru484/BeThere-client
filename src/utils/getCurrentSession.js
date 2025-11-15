// src/utils/getCurrentSession.js

/**
 * Determines the current active session for an event
 * @param {Object} event - The event object with sessions
 * @returns {Object|null} - The current session or null if no active session
 */
export const getCurrentSession = (event) => {
  if (!event || !event.sessions || event.sessions.length === 0) {
    return null;
  }

  const now = new Date();

  // Find the session that is currently active
  const currentSession = event.sessions.find((session) => {
    const sessionStart = new Date(session.startDate);
    const sessionEnd = new Date(session.endDate);

    // Check if current date/time is within the session period
    return now >= sessionStart && now <= sessionEnd;
  });

  // If no current session, find the next upcoming session
  if (!currentSession) {
    const upcomingSessions = event.sessions
      .filter((session) => new Date(session.startDate) > now)
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

    return upcomingSessions[0] || null;
  }

  return currentSession;
};
