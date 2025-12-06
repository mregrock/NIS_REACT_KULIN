import React from 'react';
import { Drawer, List, ListItem, ListItemText, Typography, Button, Box } from '@mui/material';
import { useEventLog } from '../../hooks/useEventLog';

const EventLog: React.FC = () => {
  const { logs, clearLogs } = useEventLog();

  return (
    <Drawer
      variant="permanent"
      anchor="right"
      sx={{
        width: 300,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 300,
          boxSizing: 'border-box',
          padding: 2,
        },
        display: { xs: 'none', md: 'block' },
      }}
    >
      <Typography variant="h6" gutterBottom>
        Event Log
      </Typography>
      <Button variant="outlined" color="secondary" onClick={clearLogs} fullWidth sx={{ mb: 2 }}>
        Clear Logs
      </Button>
      <List>
        {logs.map((log, index) => (
          <ListItem key={index} divider>
            <ListItemText primary={log} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default EventLog;
