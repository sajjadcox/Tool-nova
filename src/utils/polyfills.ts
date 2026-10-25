/**
 * Essential runtime polyfills for broader browser compatibility
 * (especially mobile browsers, older Chromium webviews, and Safari)
 */

// 1. Promise.withResolvers polyfill (ECMAScript 2024, required by pdfjs-dist)
if (typeof (Promise as any).withResolvers === 'undefined') {
  (Promise as any).withResolvers = function <T>() {
    let resolve!: (value: T | PromiseLike<T>) => void;
    let reject!: (reason?: any) => void;
    const promise = new Promise<T>((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve, reject };
  };
}

// 2. AbortSignal.any polyfill (required by pdfjs-dist and modern fetch handlers)
if (typeof AbortSignal !== 'undefined' && typeof (AbortSignal as any).any !== 'function') {
  (AbortSignal as any).any = function (signals: AbortSignal[]) {
    const controller = new AbortController();
    for (const signal of signals) {
      if (signal.aborted) {
        controller.abort((signal as any).reason);
        return controller.signal;
      }
      signal.addEventListener('abort', () => controller.abort((signal as any).reason), { once: true });
    }
    return controller.signal;
  };
}

// 3. Array.prototype.toReversed polyfill
if (!(Array.prototype as any).toReversed) {
  (Array.prototype as any).toReversed = function () {
    return [...this].reverse();
  };
}

// 4. Array.prototype.toSorted polyfill
if (!(Array.prototype as any).toSorted) {
  (Array.prototype as any).toSorted = function (compareFn?: (a: any, b: any) => number) {
    return [...this].sort(compareFn);
  };
}

export {};
