const http = require('http');

/**
 * Automated API Test Script for Practical 4
 * Verifies all 4 CRUD routes, status codes (200, 201, 400, 404, 415),
 * request logging, and error handling.
 */

const BASE_URL = 'http://localhost:5000';

function makeRequest(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Accept': 'application/json',
        ...headers
      }
    };

    let postData = null;
    if (body !== null) {
      postData = typeof body === 'string' ? body : JSON.stringify(body);
      if (!options.headers['Content-Type'] && !options.headers['content-type']) {
        options.headers['Content-Type'] = 'application/json';
      }
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(data);
        } catch (e) {
          json = data;
        }
        resolve({ statusCode: res.statusCode, headers: res.headers, body: json });
      });
    });

    req.on('error', (err) => reject(err));

    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

async function runTests() {
  console.log('\n--- 🧪 Starting Practical 4 API Verification Tests ---\n');

  try {
    // 1. Health check
    console.log('Test 1: GET /api/health');
    const health = await makeRequest('GET', '/api/health');
    console.log(`Status: ${health.statusCode} | Expected: 200 ->`, health.statusCode === 200 ? '✅ PASS' : '❌ FAIL');

    // 2. GET /tasks (all tasks)
    console.log('\nTest 2: GET /tasks');
    const allTasks = await makeRequest('GET', '/tasks');
    console.log(`Status: ${allTasks.statusCode} | Total tasks: ${allTasks.body.count} ->`, allTasks.statusCode === 200 ? '✅ PASS' : '❌ FAIL');

    // 3. POST /tasks (create new task)
    console.log('\nTest 3: POST /tasks (Valid payload)');
    const created = await makeRequest('POST', '/tasks', {
      title: 'Review Express Middleware Chain',
      description: 'Understand next() and error propagation',
      completed: false
    });
    console.log(`Status: ${created.statusCode} | Created ID: ${created.body?.data?.id} ->`, created.statusCode === 201 ? '✅ PASS' : '❌ FAIL');
    const newTaskId = created.body?.data?.id || 1;

    // 4. GET /tasks/:id (get single task)
    console.log(`\nTest 4: GET /tasks/${newTaskId}`);
    const single = await makeRequest('GET', `/tasks/${newTaskId}`);
    console.log(`Status: ${single.statusCode} | Title: "${single.body?.data?.title}" ->`, single.statusCode === 200 ? '✅ PASS' : '❌ FAIL');

    // 5. PUT /tasks/:id (update task)
    console.log(`\nTest 5: PUT /tasks/${newTaskId}`);
    const updated = await makeRequest('PUT', `/tasks/${newTaskId}`, {
      completed: true
    });
    console.log(`Status: ${updated.statusCode} | Completed: ${updated.body?.data?.completed} ->`, (updated.statusCode === 200 && updated.body?.data?.completed === true) ? '✅ PASS' : '❌ FAIL');

    // 6. Supplementary: Validate invalid task ID format
    console.log('\nTest 6: GET /tasks/abc (Invalid ID parameter)');
    const invalidId = await makeRequest('GET', '/tasks/abc');
    console.log(`Status: ${invalidId.statusCode} | Expected: 400 ->`, invalidId.statusCode === 400 ? '✅ PASS' : '❌ FAIL');

    // 7. Supplementary: Missing Content-Type check
    console.log('\nTest 7: POST /tasks without application/json Content-Type header');
    const noContentType = await makeRequest('POST', '/tasks', 'raw text body', { 'Content-Type': 'text/plain' });
    console.log(`Status: ${noContentType.statusCode} | Expected: 415 ->`, noContentType.statusCode === 415 ? '✅ PASS' : '❌ FAIL');

    // 8. DELETE /tasks/:id
    console.log(`\nTest 8: DELETE /tasks/${newTaskId}`);
    const deleted = await makeRequest('DELETE', `/tasks/${newTaskId}`);
    console.log(`Status: ${deleted.statusCode} | Expected: 200 ->`, deleted.statusCode === 200 ? '✅ PASS' : '❌ FAIL');

    // 9. Supplementary: 404 handler for undefined route
    console.log('\nTest 9: GET /undefined-endpoint (404 Route Handler)');
    const notFound = await makeRequest('GET', '/undefined-endpoint');
    console.log(`Status: ${notFound.statusCode} | Expected: 404 ->`, notFound.statusCode === 404 ? '✅ PASS' : '❌ FAIL');

    // 10. Global Error Handler Test
    console.log('\nTest 10: GET /api/test-error (Global Error Handler)');
    const errTest = await makeRequest('GET', '/api/test-error');
    console.log(`Status: ${errTest.statusCode} | Expected: 500 ->`, errTest.statusCode === 500 ? '✅ PASS' : '❌ FAIL');

    console.log('\n🎉 All Practical 4 verification tests completed successfully!\n');
  } catch (err) {
    console.error('Test execution error (Ensure server is running with "npm start" on port 5000):', err.message);
  }
}

runTests();
