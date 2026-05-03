type Platform = 'poki' | 'crazygames' | 'none';

interface PokiAPI {
  init?: () => Promise<void>;
  gameLoadingStart?: () => void;
  gameLoadingFinished?: () => void;
  gameplayStart?: () => void;
  gameplayStop?: () => void;
  commercialBreak?: () => Promise<void>;
  rewardedBreak?: () => Promise<boolean>;
  customEvent?: (n: string, m?: object) => void;
}

interface CrazyAPI {
  SDK?: {
    init?: () => Promise<void>;
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
    if (host.includes('poki')) return 'poki';
    if (host.includes('crazygames')) return 'crazygames';
    if (window.PokiSDK) return 'poki';
    if (window.CrazyGames) return 'crazygames';
    return 'none';
  }

  async init(): Promise<void> {
    this.platform = this.detect();
    try {
      if (this.platform === 'poki' && window.PokiSDK?.init) {
        await window.PokiSDK.init();
        window.PokiSDK.gameLoadingStart?.();
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

  async showInterstitial(): Promise<void> {
    try {
      if (this.platform === 'poki' && window.PokiSDK?.commercialBreak) {
        await window.PokiSDK.commercialBreak();
      } else if (this.platform === 'crazygames' && window.CrazyGames?.SDK?.ad?.requestAd) {
        await window.CrazyGames.SDK.ad.requestAd('midgame');
      }
    } catch (e) {
      console.warn('[ad] interstitial failed', e);
    }
  }

  async showRewarded(): Promise<boolean> {
    try {
      if (this.platform === 'poki' && window.PokiSDK?.rewardedBreak) {
        return (await window.PokiSDK.rewardedBreak()) ?? true;
      } else if (this.platform === 'crazygames' && window.CrazyGames?.SDK?.ad?.requestAd) {
        await window.CrazyGames.SDK.ad.requestAd('rewarded');
        return true;
      }
      return await this.dummyRewarded();
    } catch (e) {
      console.warn('[ad] rewarded failed', e);
      return false;
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
