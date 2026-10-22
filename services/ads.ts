/**
 * Rewarded ad boundary ("광고 보고 2배 받기"). No ad SDK is integrated yet:
 * the mock asks the UI to show a 3-second placeholder and resolves true.
 */
export interface RewardedAds {
  readonly isMock: boolean;
  /** Resolves true when the reward should be granted. */
  show(): Promise<boolean>;
}

type Presenter = () => Promise<boolean>;
let presenter: Presenter | null = null;

/** The placeholder overlay registers itself here. */
export const registerAdPresenter = (p: Presenter | null) => {
  presenter = p;
};

export class MockRewardedAds implements RewardedAds {
  readonly isMock = true;
  async show() {
    return presenter ? presenter() : true;
  }
}

export const rewardedAds: RewardedAds = new MockRewardedAds();
