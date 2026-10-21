const EventEmitter = require('events');

/**
 * Dedicated Event Emitter Module
 * Step 1: Singleton instance of EventEmitter for decoupling tasks events
 */
class TaskEvents extends EventEmitter {}

module.exports = new TaskEvents();
