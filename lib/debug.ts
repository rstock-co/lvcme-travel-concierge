/**
 * Debug utilities for the travel concierge implementation
 */

// Enable or disable debug logging
const DEBUG_ENABLED = process.env.NODE_ENV === 'development';

/**
 * Log debug information for tool invocations
 * @param toolName Name of the tool being invoked
 * @param params Input parameters to the tool
 * @param result Output from the tool
 */
export function logToolInvocation(toolName: string, params: any, result: any) {
  if (!DEBUG_ENABLED) return;

  console.log(`[${toolName}] Input:`, JSON.stringify(params, null, 2));
  console.log(`[${toolName}] Output:`, JSON.stringify(result, null, 2));
}

/**
 * Log debug information for the travel planning chain
 * @param input Input to the travel planning chain
 * @param output Output from the travel planning chain
 */
export function logTravelPlanningChain(input: any, output: any) {
  if (!DEBUG_ENABLED) return;

  console.log('Input to travel planning chain:', JSON.stringify(input, null, 2));
  console.log('Travel plan output:', JSON.stringify(output, null, 2));
}

/**
 * Log API rate limit information
 * @param apiName Name of the API
 * @param remainingRequests Number of remaining requests
 * @param resetTime Time when the rate limit resets
 */
export function logRateLimit(apiName: string, remainingRequests: number, resetTime?: Date) {
  if (!DEBUG_ENABLED) return;

  console.log(`[${apiName}] Rate limit: ${remainingRequests} requests remaining`);
  if (resetTime) {
    console.log(`[${apiName}] Rate limit resets at: ${resetTime.toISOString()}`);
  }
}

/**
 * Log errors with additional context
 * @param context Context where the error occurred
 * @param error The error object
 */
export function logError(context: string, error: any) {
  console.error(`[ERROR] ${context}:`, error);
}
