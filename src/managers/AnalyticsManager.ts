type EventName =
  | 'session_start'
  | 'level_started'
  | 'level_completed'
  | 'level_failed'
  | 'block_moved'
  | 'hint_used'
  | 'ad_request'
  | 'ad_complete'
  | 'ad_error';

interface AnalyticsEvent {
  name: EventName;
  ts: number;
  meta?: Record<string, unknown>;
}

class AnalyticsManagerImpl {
  private buffer: AnalyticsEvent[] = [];

  log(name: EventName, meta?: Record<string, unknown>): void {
    const e: AnalyticsEvent = { name, ts: Date.now(), meta };
    this.buffer.push(e);
    if (this.buffer.length > 200) this.buffer.shift();

    const w = window as unknown as {
      PokiSDK?: {
        customEvent?: (noun: string, verb: string, value?: string, payload?: object) => void;
      };
    };
    try {
      const sep = name.indexOf('_');
      const noun = sep >= 0 ? name.slice(0, sep) : name;
      const verb = sep >= 0 ? name.slice(sep + 1) : 'event';
      w.PokiSDK?.customEvent?.(noun, verb, '', meta || {});
    } catch {
      /* noop */
    }
    console.debug('[analytics]', name, meta || '');
  }

  recent(): AnalyticsEvent[] {
    return [...this.buffer];
  }
}

export const Analytics = new AnalyticsManagerImpl();
