import { CallHandler } from '@nestjs/common';
import { tap, throwError } from 'rxjs';

const SUCCESS_THRESHOLD = 3; // Number of sucxcessful requests before closing the circuit
const FAILURE_THRESHOLD = 3; // Number of failed requests before opening the circuit
const OPEN_TO_HALF_OPEN_WAIT_TIME = 60_000; // Time to wait before moving from open to half-open state

enum CircuitBreakerState {
  Closed,
  Open,
  HalfOpen,
}

export class CircuitBreaker {
  private state = CircuitBreakerState.Closed;
  private failureCount = 0;
  private successCount = 0;
  private lastError: Error;
  private nextAttempt: number;

  /**
   * Executes the provided CallHandler function while applying circuit breaker logic.
   * If the circuit breaker state is open, it checks if the next attempt is allowed based on the configured time.
   * If the next attempt is not allowed, it throws the last error encountered.
   * If the circuit breaker state is open and the next attempt is allowed, it changes the state to half-open.
   * Finally, it handles the execution of the CallHandler function and handles the success and error cases.
   * @param next The CallHandler function to be executed.
   * @returns An Observable that emits the result of the CallHandler function.
   */
  exec(next: CallHandler) {
    if (this.state === CircuitBreakerState.Open) {
      if (this.nextAttempt > Date.now()) {
        return throwError(() => this.lastError);
      }
      this.state = CircuitBreakerState.HalfOpen;
    }
    return next.handle().pipe(
      tap({
        next: () => this.handleSuccess(),
        error: (err) => this.handleError(err),
      }),
    );
  }

  /**
   * Handles the success scenario in the circuit breaker.
   * Resets the failure count and updates the state if necessary.
   */
  private handleSuccess() {
    this.failureCount = 0;
    if (this.state === CircuitBreakerState.HalfOpen) {
      this.successCount++;
      if (this.successCount >= SUCCESS_THRESHOLD) {
        this.state = CircuitBreakerState.Closed;
      }
    }
  }

  /**
   * Handles the error encountered during circuit breaker operation.
   * Increments the failure count and updates the circuit breaker state based on the failure count and current state.
   * If the failure count exceeds the failure threshold or the circuit breaker is in the half-open state,
   * the circuit breaker state is set to open, the last error is updated, and the next attempt time is calculated.
   * @param err The error encountered during circuit breaker operation.
   */
  private handleError(err: Error) {
    this.failureCount++;
    if (
      this.failureCount >= FAILURE_THRESHOLD ||
      this.state === CircuitBreakerState.HalfOpen
    ) {
      this.state = CircuitBreakerState.Open;
      this.lastError = err;
      this.nextAttempt = Date.now() + OPEN_TO_HALF_OPEN_WAIT_TIME;
    }
  }
}
