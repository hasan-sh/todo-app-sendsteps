import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  TextField,
  Checkbox,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Box,
  FormControlLabel,
  Snackbar,
  Alert,
} from '@mui/material';

import { serverRequest, useDebounce } from './utils';
import TaskCard from './components/TaskCard';

interface Task {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
  created_at: string;
}

interface Suggestion {
  title: string;
  description: string;
}

const TodoApp = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  const [aiSuggestions, setAISuggestions] = useState<Suggestion[]>([]);
  const [autoAiSuggestions, setAutoAiSuggestions] = useState(false);

  const [showAIDialog, setShowAIDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await serverRequest({path: "tasks"});
        setTasks(data);
      } catch (error) {
        setError("Error fetching tasks, see console");
        console.error(error);
      }
    };
    fetchTasks();
    console.log("effect!!")
  }, []);
    
  const addTask = async () => {
    if (!newTask.title || !newTask.description) return;
    
    try {
      const data = await serverRequest({method: "POST", path: "tasks", body: JSON.stringify(newTask)});
      setTasks([data, ...tasks]);
      setNewTask({ title: '', description: '' });
    } catch (error) {
      setError('Error adding task, see console');
      console.error(error);
    }
  };

  const updateTask = async (task: Task) => {
    try {
      await serverRequest({method: "PUT", path: `tasks/${task._id}`, body: JSON.stringify(task)});
      const updatedTasks = tasks.map((t) => 
        t._id === task._id ? task : t
      );
      setTasks(updatedTasks);
    } catch (error) {
      setError('Error updating task, see console');
      console.error(error);
    }
  };

  const deleteTask = async () => {
    if (!deletingTask) return;

    try {
      await serverRequest({method: "DELETE", path: `tasks/${deletingTask._id}`});
      const updatedTasks = tasks.filter((t) => t._id !== deletingTask._id);
      setTasks(updatedTasks);
      setDeletingTask(null);
    } catch (error) {
      setError('Error deleting task, see console');
      console.error(error);
    }
  };



  const getSuggestions = async () => {
    if (newTask.description.length < 3) {
      if (aiSuggestions.length) setAISuggestions([])
      return;
    };

    try {
      const suggestions = await serverRequest({
          method: "POST",
          path: "suggestions",
          body: JSON.stringify({ title: newTask.title, description: newTask.description }),
        });
      setAISuggestions(suggestions);
      if (autoAiSuggestions) {
        setShowAIDialog(true);
      }
    } catch (error) {
      setError('Error getting AI suggestions, see console.');
      console.error(error);
    }
  };

  const debouncedGetSuggestions = useDebounce(getSuggestions, 500);


  return (
    <>
      <Card sx={{ maxWidth: 800, mx: "auto", mt: 4, p: 2 }}>
        <CardHeader
          title="Interactive To-Do List"
          titleTypographyProps={{ variant: "h5", textAlign: "center" }}
        />
        <CardContent>
          <TextField
            label="Task Title"
            fullWidth
            variant="outlined"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Task Description"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={newTask.description}
            onChange={(e) => {
              const value = e.target.value;
              setNewTask({ ...newTask, description: value });
              debouncedGetSuggestions(value);
            }}
            sx={{ mb: 2, flex: 2 }}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={autoAiSuggestions}
                onChange={(event) => setAutoAiSuggestions(event.target.checked)}
                color="primary"
              />
            }
            label={autoAiSuggestions ? "AI Suggestions Enabled" : "AI Suggestions Disabled"}
          />
          <Box display="flex" gap={2} alignItems="center">
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setShowAIDialog(true)}
              disabled={aiSuggestions.length < 1}
              sx={{ flex: 0.3 }}
            >
              AI Suggestions
            </Button>

            <Button
              variant="contained"
              color="primary"
              onClick={addTask}
              disabled={!newTask.title || !newTask.description}
              sx={{
                flex: 0.7,
                fontWeight: "bold",
                paddingX: 3,
              }}
            >
              Add Task
            </Button>
          </Box>

          {tasks.map((task) => (
            <TaskCard
              task={task}
              updateTask={updateTask}
              setDeletingTask={setDeletingTask}
            />
          ))}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <Dialog open={showAIDialog} onClose={() => setShowAIDialog(false)}>
        <DialogTitle>AI Task Suggestions</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Choose from these related task suggestions:
          </DialogContentText>
          {aiSuggestions &&
            aiSuggestions.map((suggestion, index) => (
              <Card
                key={index}
                sx={{
                  p: 2,
                  mt: 2,
                  cursor: "pointer",
                  ":hover": { backgroundColor: "lightgray" },
                }}
                onClick={() => {
                  setNewTask(suggestion);
                  setShowAIDialog(false);
                  // remove selected suggestion.
                  setAISuggestions((prevSuggestions) =>
                    prevSuggestions.filter(
                      (_, suggestionIndex) => suggestionIndex !== index
                    )
                  );
                }}
              >
                <Typography variant="body1">{suggestion.title}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {suggestion.description}
                </Typography>
              </Card>
            ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAIDialog(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!deletingTask} onClose={() => setDeletingTask(null)}>
        <DialogTitle>Delete Task</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this task? <br />{" "}
            <span style={{ fontSize: "0.7em" }}>
              This action cannot be undone.
            </span>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeletingTask(null)} color="primary">
            Cancel
          </Button>
          <Button onClick={deleteTask} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setError(null)} severity="error" variant="filled">
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default TodoApp;
