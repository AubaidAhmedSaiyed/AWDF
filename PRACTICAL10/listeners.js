const taskEvents = require('./events');

/**
 * Event Listeners Module
 * Step 2 & 5: Registers asynchronous listeners for task lifecycle events
 * Uses a non-blocking delay to illustrate background processing after response is sent.
 */
taskEvents.on('task-created', (task) => {
  console.log(`[Notification Listener] Event received for "${task.title}". Processing background work...`);

  // Step 5: Artificial delay (800ms) simulating sending emails / push notifications
  setTimeout(() => {
    const timestamp = new Date().toISOString();
    console.log(`[Notification] Task "${task.title}" created at ${timestamp} (Assigned: ${task.assignedUser || 'General'})`);
    console.log(`[Notification] Background notification sent successfully at ${timestamp}`);
  }, 800);
});

module.exports = taskEvents;
