import React, { createContext, useState, useCallback, type ReactNode } from 'react';

interface EventContextType {
  logs: string[];
  addLog: (message: string) => void;
  clearLogs: () => void;
}

export const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [logs, setLogs] = useState<string[]>(() => {
    const saved = localStorage.getItem('event-logs');
    return saved ? JSON.parse(saved) : [];
  });

  const addLog = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => {
      const newLogs = [`[${timestamp}] ${message}`, ...prev];
      localStorage.setItem('event-logs', JSON.stringify(newLogs));
      return newLogs;
    });
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
    localStorage.removeItem('event-logs');
  }, []);

  return (
    <EventContext.Provider value={{ logs, addLog, clearLogs }}>
      {children}
    </EventContext.Provider>
  );
};
