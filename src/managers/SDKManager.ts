import { AudioManager } from './AudioManager';

type Platform = 'poki' | 'crazygames' | 'none';
type RewardedSize = 'small' | 'medium' | 'large';

interface PokiAPI {
  init?: () => Promise<void>;
  gameLoadingFinished?: () => void;
  gameplayStart?: () => void;
  gameplayStop?: () => void;
  commercialBreak?: (onStart?: () => void) => Promise<void>;
  rewardedBreak?: (opts?: { size?: RewardedSize; onStart?: () => void }) => Promise<boolean>;
  customEvent?: (noun: string, verb: string, value?: string, payload?: object) => void;
}

interface CrazyAPI {
  SDK?: {
    init?: () => Promise<void>;
    environment?: 'local' | 'staging' | 'crazygames';
    game?: {
      gameplayStart?: () => void;
      gameplayStop?: () => void;
      loadingStart?: () => void;
      loadingStop?: () => void;
      happytime?: () => void;
    };
    ad?: {
      requestAd?: (type: 'midgame' | 'rewarded') => Promise<void>;
    };
  };
}

declare const __BUILD_TARGET__: string;

declare global {
  interface Window {
    PokiSDK?: PokiAPI;
    CrazyGames?: CrazyAPI;
  }
}

const AD_TIMEOUT_MS = 15000;

class SDKManagerImpl {
  private platform: Platform = 'none';
  private ready = false;
  private adInFlight = false;

  detect(): Platform {
    if (typeof __BUILD_TARGET__ !== 'undefined' && __BUILD_TARGET__ === 'itch') return 'none';
    const host = window.location.hostname;
    if (host.includes('poki') || window.PokiSDK) return 'poki';
    if (host.includes('crazygames') || window.CrazyGames) return 'crazygames';
    return 'none';
  }

  getPlatform(): Platform {
    return this.platform;
  }

  hasRewardedAds(): boolean {
    return this.platform === 'poki' || this.platform === 'crazygames';
  }

  async init(): Promise<void> {
    this.platform = this.detect();
    try {
      if (this.platform === 'poki' && window.PokiSDK?.init) {
        await window.PokiSDK.init();
      } else if (this.platform === 'crazygames' && window.CrazyGames?.SDK?.init) {
        await window.CrazyGames.SDK.init();
        window.CrazyGames.SDK.game?.loadingStart?.();
      }
      this.ready = true;
      console.info('[SDK]', this.platform, 'ready');
    } catch (e) {
      console.warn('[SDK] init failed', e);
    }
  }

  loadingFinished(): void {
    if (!this.ready) return;
    window.PokiSDK?.gameLoadingFinished?.();
    window.CrazyGames?.SDK?.game?.loadingStop?.();
  }

  gameplayStart(): void {
    window.PokiSDK?.gameplayStart?.();
    window.CrazyGames?.SDK?.game?.gameplayStart?.();
  }

  gameplayStop(): void {
    window.PokiSDK?.gameplayStop?.();
    window.CrazyGames?.SDK?.game?.gameplayStop?.();
  }

  happytime(): void {
    window.CrazyGames?.SDK?.game?.happytime?.();
  }

  isAdInFlight(): boolean {
    return this.adInFlight;
  }

  private withTimeout<T>(p: Promise<T>, fallback: T, ms = AD_TIMEOUT_MS): Promise<T> {
    return Promise.race([
      p,
      new Promise<T>((resolve) =>
        setTimeout(() => {
          console.warn('[ad] timeout after', ms, 'ms');
          resolve(fallback);
        }, ms)
      ),
    ]);
  }

  // Poki spec: call BEFORE gameplayStart() at natural breaks (level start).
  // Wraps platform call. Stops gameplay during ad, resumes after.
  async commercialBreak(): Promise<void> {
    if (this.adInFlight) return;
    this.adInFlight = true;
    AudioManager.duckForAd(true);
    try {
      if (this.platform === 'poki' && window.PokiSDK?.commercialBreak) {
        this.gameplayStop();
        await this.withTimeout(window.PokiSDK.commercialBreak(), undefined);
      } else if (this.platform === 'crazygames' && window.CrazyGames?.SDK?.ad?.requestAd) {
        this.gameplayStop();
        await this.withTimeout(window.CrazyGames.SDK.ad.requestAd('midgame'), undefined);
      }
    } catch (e) {
      console.warn('[ad] commercialBreak failed', e);
    } finally {
      this.adInFlight = false;
      AudioManager.duckForAd(false);
    }
  }

  async rewarded(size: RewardedSize = 'medium'): Promise<boolean> {
    if (this.adInFlight) return false;
    this.adInFlight = true;
    AudioManager.duckForAd(true);
    try {
      if (this.platform === 'poki' && window.PokiSDK?.rewardedBreak) {
        const result = await this.withTimeout(
          window.PokiSDK.rewardedBreak({ size }),
          false
        );
        return result !== false;
      }
      if (this.platform === 'crazygames' && window.CrazyGames?.SDK?.ad?.requestAd) {
        await this.withTimeout(window.CrazyGames.SDK.ad.requestAd('rewarded'), undefined);
        return true;
      }
      return await this.dummyRewarded();
    } catch (e) {
      console.warn('[ad] rewarded failed', e);
      return false;
    } finally {
      this.adInFlight = false;
      AudioManager.duckForAd(false);
    }
  }

  customEvent(name: string, meta?: object): void {
    try {
      const sep = name.indexOf('_');
      const noun = sep >= 0 ? name.slice(0, sep) : name;
      const verb = sep >= 0 ? name.slice(sep + 1) : 'event';
      window.PokiSDK?.customEvent?.(noun, verb, '', meta || {});
    } catch {
      /* noop */
    }
  }

  private dummyRewarded(): Promise<boolean> {
    return new Promise((resolve) => setTimeout(() => resolve(true), 700));
  }
}

export const SDKManager = new SDKManagerImpl();
