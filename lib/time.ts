/**
 * Get the current time, respecting TEST_MODE if enabled
 */
export function getCurrentTime(headers?: Headers): number {
  if (process.env.TEST_MODE === '1' && headers) {
    const testNow = headers.get('x-test-now-ms');
    if (testNow) {
      return parseInt(testNow, 10);
    }
  }
  return Date.now();
}

