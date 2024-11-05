import { Router } from 'express';
import taskController from '../controllers/task.js';
import aiController from '../controllers/ai.js';

const router = Router();

router.get('/tasks', taskController.getAllTasks);
router.post('/tasks', taskController.createTask);
router.put('/tasks/:id', taskController.updateTask);
router.delete('/tasks/:id', taskController.deleteTask);
router.post('/suggestions', aiController.suggestTasks);

export default router;
