/**
 * Lightweight in-process task queue.
 * No Redis dependency — runs within Node.js memory.
 *
 * Features:
 * - FIFO processing with configurable concurrency
 * - Automatic retry with exponential backoff (3 attempts)
 * - Dead-letter logging for permanently failed tasks
 * - Graceful drain for shutdown
 * - Stats for health endpoint
 */

const logger = require("../config/logger");

const MAX_RETRIES = 3;
const BASE_DELAY_MS = 2000; // 2s → 4s → 8s
const CONCURRENCY = 2;

/** @type {{ name: string, fn: () => Promise<void>, attempt: number }[]} */
const queue = [];
let activeCount = 0;
let stats = { pending: 0, processing: 0, completed: 0, failed: 0 };
let draining = false;
let drainResolve = null;

/**
 * Enqueue a task for background processing.
 * @param {string} name  - Human-readable task name for logs
 * @param {() => Promise<void>} fn - Async function to execute
 */
function enqueue(name, fn) {
  if (draining) {
    logger.warn({ task: name }, "Queue is draining — task rejected");
    return;
  }
  queue.push({ name, fn, attempt: 1 });
  stats.pending++;
  process.nextTick(processNext);
}

/** Process the next task if concurrency allows. */
function processNext() {
  if (activeCount >= CONCURRENCY || queue.length === 0) {
    // If draining and nothing left, resolve
    if (draining && activeCount === 0 && queue.length === 0 && drainResolve) {
      drainResolve();
    }
    return;
  }

  const task = queue.shift();
  stats.pending--;
  stats.processing++;
  activeCount++;

  task
    .fn()
    .then(() => {
      stats.processing--;
      stats.completed++;
      activeCount--;
      logger.info({ task: task.name }, "Task completed");
      process.nextTick(processNext);
    })
    .catch((err) => {
      stats.processing--;
      activeCount--;

      if (task.attempt < MAX_RETRIES) {
        const delay = BASE_DELAY_MS * Math.pow(2, task.attempt - 1);
        logger.warn(
          { task: task.name, attempt: task.attempt, nextRetryMs: delay, err: err.message },
          "Task failed — scheduling retry"
        );
        task.attempt++;
        stats.pending++;
        setTimeout(() => {
          queue.push(task);
          process.nextTick(processNext);
        }, delay);
      } else {
        stats.failed++;
        logger.error(
          { task: task.name, attempts: task.attempt, err: err.message },
          "Task permanently failed — dead letter"
        );
      }
      process.nextTick(processNext);
    });
}

/** Get current queue statistics. */
function getStats() {
  return { ...stats, queueLength: queue.length };
}

/**
 * Drain the queue — wait for all in-flight tasks to finish.
 * Called during graceful shutdown.
 * @returns {Promise<void>}
 */
function drain() {
  draining = true;
  if (activeCount === 0 && queue.length === 0) {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    drainResolve = resolve;
    // Safety timeout: don't hang shutdown forever
    setTimeout(() => {
      logger.warn("Queue drain timeout — forcing shutdown");
      resolve();
    }, 10000);
  });
}

module.exports = { enqueue, getStats, drain };
