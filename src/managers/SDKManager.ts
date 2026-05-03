type Platform = 'poki' | 'crazygames' | 'none';
type RewardedSize = 'small' | 'medium' | 'large';

interface PokiAPI {
  init?: () => Promise<void>;
  gameLoadingFinished?: () => void;
  gameplayStart?: () => void;
  gameplayStop?: () => void;
  commercialBreak?: (onStart?: () => void) => Promise<void>;
  rewardedBreak?: (opts?: { size?: RewardedSize; onStart?: () => void }) => Promise<boolean>;
  customEvent?: (n: string, m?: object) => void;
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

declare global {
  interface Window {
    PokiSDK?: PokiAPI;
    CrazyGames?: CrazyAPI;
  }
}

class SDKManagerImpl {
  private platform: Platform = 'none';
  private ready = false;

  detect(): Platform {
    const host = window.location.hostname;
    if (host.includes('poki') || window.PokiSDK) return 'poki';
    if (host.includes('crazygames') || window.CrazyGames) return 'crazygames';
    return 'none';
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

  // Poki spec: call BEFORE gameplayStart() at natural breaks (level start).
  // Wraps platform call. Stops gameplay during ad, resumes after.
  async commercialBreak(): Promise<void> {
    try {
      if (this.platform === 'poki' && window.PokiSDK?.commercialBreak) {
        this.gameplayStop();
        await window.PokiSDK.commercialBreak();
      } else if (this.platform === 'crazygames' && window.CrazyGames?.SDK?.ad?.requestAd) {
        this.gameplayStop();
        await window.CrazyGames.SDK.ad.requestAd('midgame');
      }
    } catch (e) {
      console.warn('[ad] commercialBreak failed', e);
    }
  }

  async rewarded(size: RewardedSize = 'medium'): Promise<boolean> {
    try {
      if (this.platform === 'poki' && window.PokiSDK?.rewardedBreak) {
        const result = await window.PokiSDK.rewardedBreak({ size });
        return result !== false;
      }
      if (this.platform === 'crazygames' && window.CrazyGames?.SDK?.ad?.requestAd) {
        await window.CrazyGames.SDK.ad.requestAd('rewarded');
        return true;
      }
      return await this.dummyRewarded();
    } catch (e) {
      console.warn('[ad] rewarded failed', e);
      return false;
    }
  }

  customEvent(name: string, meta?: object): void {
    try {
      window.PokiSDK?.customEvent?.(name, meta);
    } catch {
      /* noop */
    }
  }

  private dummyRewarded(): Promise<boolean> {
    return new Promise((resolve) => setTimeout(() => resolve(true), 700));
  }

  getPlatform(): Platform {
    return this.platform;
  }
}

export const SDKManager = new SDKManagerImpl();
