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
      PokiSDK?: { customEvent?: (n: string, m?: object) => void };
      CrazyGames?: { SDK?: { analytics?: { trackEvent?: (n: string, m?: object) => void } } };
    };
    try {
      w.PokiSDK?.customEvent?.(name, meta);
      w.CrazyGames?.SDK?.analytics?.trackEvent?.(name, meta);
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
