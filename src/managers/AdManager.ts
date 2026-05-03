import { SDKManager } from './SDKManager';
import { Analytics } from './AnalyticsManager';

export type AdPlacement = 'level_complete' | 'continue' | 'hint';

class AdManagerImpl {
  private interstitialCounter = 0;
  private interstitialEvery = 3;

  async showInterstitialIfDue(placement: AdPlacement): Promise<void> {
    this.interstitialCounter++;
    if (this.interstitialCounter < this.interstitialEvery) return;
    this.interstitialCounter = 0;
    Analytics.log('ad_request', { placement, type: 'interstitial' });
    await SDKManager.showInterstitial();
    Analytics.log('ad_complete', { placement, type: 'interstitial' });
  }

  async showRewarded(placement: AdPlacement): Promise<boolean> {
    Analytics.log('ad_request', { placement, type: 'rewarded' });
    const ok = await SDKManager.showRewarded();
    Analytics.log(ok ? 'ad_complete' : 'ad_error', { placement, type: 'rewarded' });
    return ok;
  }
}

export const AdManager = new AdManagerImpl();
