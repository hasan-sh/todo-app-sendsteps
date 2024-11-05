import request from 'supertest';
import mongoose from 'mongoose';

import app from '../index.js';
import { Task } from '../models/Task.js';

beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/todo-app-test');
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

beforeEach(async () => {
  await Task.deleteMany({});
});

describe('Task API', () => {
  test('POST /api/tasks - should create a new task', async () => {
    const response = await request(app)
      .post('/api/tasks')
      .send({
        title: 'Test Task',
        description: 'Test Description'
      });

    expect(response.status).toBe(201);
    expect(response.body.title).toBe('Test Task');
    expect(response.body.description).toBe('Test Description');
    expect(response.body.completed).toBe(false);
  });

  test('GET /api/tasks - should return all tasks', async () => {
    await Task.create([
      { title: 'Task 1', description: 'Description 1' },
      { title: 'Task 2', description: 'Description 2' }
    ]);

    const response = await request(app).get('/api/tasks');

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
    expect(response.body[0].title).toBe('Task 1');
    expect(response.body[1].title).toBe('Task 2');
  });

  test('PUT /api/tasks/:id - should update a task', async () => {
    const task = await Task.create({
      title: 'Original Task',
      description: 'Original Description'
    });

    const response = await request(app)
      .put(`/api/tasks/${task._id}`)
      .send({
        title: 'Updated Task',
        description: 'Updated Description',
        completed: true
      });

    expect(response.status).toBe(200);
    expect(response.body.title).toBe('Updated Task');
    expect(response.body.description).toBe('Updated Description');
    expect(response.body.completed).toBe(true);
  });

  test('DELETE /api/tasks/:id - should delete a task', async () => {
    const task = await Task.create({
      title: 'Task to Delete',
      description: 'Description'
    });

    const response = await request(app).delete(`/api/tasks/${task._id}`);

    expect(response.status).toBe(200);
    
    const deletedTask = await Task.findById(task._id);
    expect(deletedTask).toBeNull();
  });
});
