// TaskCard.tsx
import React, { useState } from 'react';
import { Card, Checkbox, Typography, Button, TextField, Box, Tooltip } from '@mui/material';

interface Task {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
  created_at: string;
}

interface TaskCardProps {
  task: Task;
  updateTask: (task: Task) => void;
  setDeletingTask: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, updateTask, setDeletingTask }) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description);

  // Handle title and description save
  const handleSave = () => {
    updateTask({ ...task, title: editedTitle, description: editedDescription });
    setIsEditingTitle(false);
    setIsEditingDescription(false);
  };

  return (
    <Card
      key={task._id}
      sx={{
        display: 'flex',
        alignItems: 'center',
        p: 2,
        mt: 2,
        gap: 2,
        opacity: task.completed ? 0.7 : 1,
        background: task.completed ? "palegreen" : "#f0f0f0",
      }}
    >
        <Checkbox
            checked={task.completed}
            onChange={() => updateTask({ ...task, completed: !task.completed })}
        />

        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>

        {/* Editable Title */}
        {isEditingTitle ? (
          <TextField
            variant="standard"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
            }}
            autoFocus
            fullWidth
          />
        ) : (
          <Tooltip title="Edit title" arrow followCursor>
            <Typography
              variant="body1"
              sx={{
                  cursor: 'pointer',
                  borderBottom: '1px dotted',
              }}
              onClick={() => setIsEditingTitle(true)}
            >
              {task.title} <span style={{ color: 'gray', fontSize: '0.8em' }}>{new Date(task.created_at).toLocaleString()}</span>
            </Typography>
          </Tooltip>
        )}

        {/* Editable Description */}
        {isEditingDescription ? (
          <TextField
            variant="standard"
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
            }}
            autoFocus
            fullWidth
            multiline
          />
        ) : (            
          <Tooltip title="Edit description" arrow followCursor>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{
                  cursor: 'pointer',
                  borderBottom: '1px dotted',
              }}
              onClick={() => setIsEditingDescription(true)}
            >
              {task.description}
            </Typography>
          </Tooltip>
        )}
      </Box>

      <Button variant="outlined" color="secondary" onClick={() => setDeletingTask(task)}>
        Delete
      </Button>
    </Card>
  );
};

export default TaskCard;
