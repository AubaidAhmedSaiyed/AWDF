// test_api.js - Automated Test Runner for Practical 5 API
const BASE_URL = 'http://localhost:5000';

const runTests = async () => {
  console.log('\n======================================================');
  console.log(' Starting Practical 5 Automated API & Validation Tests');
  console.log('======================================================\n');

  let passed = 0;
  let total = 0;

  const assert = (condition, testName, extra = '') => {
    total++;
    if (condition) {
      console.log(`\x1b[32m✔ [PASS]\x1b[0m ${testName} ${extra}`);
      passed++;
    } else {
      console.error(`\x1b[31m✖ [FAIL]\x1b[0m ${testName} ${extra}`);
    }
  };

  try {
    // 1. Health check
    const healthRes = await fetch(`${BASE_URL}/api/health`);
    const healthData = await healthRes.json();
    assert(healthRes.status === 200 && healthData.status === 'OK', '1. Server Health Check');

    // 2. POST /tasks - Valid Task with title whitespace for pre-save trim hook
    const createRes = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: '   Learn Mongoose Schema Design   ',
        description: 'Explore schemas, models, and pre-save hooks in MongoDB',
        completed: false,
        priority: 'high'
      })
    });
    const createData = await createRes.json();
    assert(createRes.status === 201, '2. POST /tasks - Create task with valid payload');
    assert(createData.data.title === 'Learn Mongoose Schema Design', '3. Pre-save hook test - Title whitespace trimmed successfully');
    assert(createData.data.priority === 'high', '4. Schema field test - Priority set to high');
    assert(createData.data.completed === false, '5. Schema default test - Completed defaults to false');
    assert(Boolean(createData.data.createdAt), '6. Schema default test - createdAt auto-populated');

    const createdId = createData.data._id;

    // 3. POST /tasks - Validation Failure: Missing title (Required Field)
    const noTitleRes = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        description: 'Missing title task',
        priority: 'low'
      })
    });
    const noTitleData = await noTitleRes.json();
    assert(noTitleRes.status === 400, '7. POST /tasks - Reject missing required field with HTTP 400');
    assert(noTitleData.error === 'ValidationError', '8. Structured error - error is ValidationError');
    assert(Boolean(noTitleData.fields?.title), '9. Structured error - fields.title details provided');

    // 4. POST /tasks - Validation Failure: Invalid Enum Priority
    const badEnumRes = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Task with invalid priority',
        priority: 'urgent' // Not in ['low', 'medium', 'high']
      })
    });
    const badEnumData = await badEnumRes.json();
    assert(badEnumRes.status === 400, '10. POST /tasks - Reject invalid priority enum with HTTP 400');
    assert(Boolean(badEnumData.fields?.priority), '11. Structured error - fields.priority details provided');

    // 5. GET /tasks - Get all tasks
    const getAllRes = await fetch(`${BASE_URL}/tasks`);
    const getAllData = await getAllRes.json();
    assert(getAllRes.status === 200, '12. GET /tasks - Fetch all tasks');
    assert(Array.isArray(getAllData.data) && getAllData.count > 0, '13. GET /tasks - Returns data array and count');

    // 6. GET /tasks/:id - Get single task
    const getOneRes = await fetch(`${BASE_URL}/tasks/${createdId}`);
    const getOneData = await getOneRes.json();
    assert(getOneRes.status === 200, '14. GET /tasks/:id - Fetch existing task by ID');
    assert(getOneData.data._id === createdId, '15. GET /tasks/:id - Returned task ID matches');

    // 7. GET /tasks/:id - 404 on non-existent valid ObjectId
    const fakeId = '507f1f77bcf86cd799439011';
    const notFoundRes = await fetch(`${BASE_URL}/tasks/${fakeId}`);
    const notFoundData = await notFoundRes.json();
    assert(notFoundRes.status === 404, '16. GET /tasks/:id - Return 404 JSON for non-existent ID');
    assert(notFoundData.error === 'NotFoundError', '17. Structured 404 response returned');

    // 8. GET /tasks/:id - 400 on malformed ObjectId (CastError handling)
    const malformedRes = await fetch(`${BASE_URL}/tasks/invalid-object-id-123`);
    const malformedData = await malformedRes.json();
    assert(malformedRes.status === 400, '18. GET /tasks/:id - Handle malformed ObjectId with 400');
    assert(malformedData.error === 'InvalidIdError', '19. CastError parsed into structured JSON');

    // 9. PUT /tasks/:id - Update task
    const updateRes = await fetch(`${BASE_URL}/tasks/${createdId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        completed: true,
        priority: 'low'
      })
    });
    const updateData = await updateRes.json();
    assert(updateRes.status === 200, '20. PUT /tasks/:id - Update task');
    assert(updateData.data.completed === true, '21. PUT /tasks/:id - completed updated to true');
    assert(updateData.data.priority === 'low', '22. PUT /tasks/:id - priority updated to low');

    // 10. DELETE /tasks/:id - Delete task
    const deleteRes = await fetch(`${BASE_URL}/tasks/${createdId}`, {
      method: 'DELETE'
    });
    assert(deleteRes.status === 200, '23. DELETE /tasks/:id - Delete task');

    // 11. Confirm deleted task returns 404
    const verifyDeletedRes = await fetch(`${BASE_URL}/tasks/${createdId}`);
    assert(verifyDeletedRes.status === 404, '24. GET /tasks/:id after delete returns 404');

    console.log('\n------------------------------------------------------');
    console.log(`Test Summary: ${passed}/${total} tests passed!`);
    if (passed === total) {
      console.log('\x1b[32m✔ ALL PRACTICAL 5 API & SCHEMA VALIDATION TESTS PASSED!\x1b[0m');
    } else {
      console.error('\x1b[31m✖ Some tests failed.\x1b[0m');
    }
    console.log('------------------------------------------------------\n');
  } catch (err) {
    console.error('Test execution error:', err.message);
  }
};

runTests();
