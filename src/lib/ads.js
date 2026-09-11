// Set PUBLIC_ADSENSE_CLIENT to your own publisher ID to serve ads; when it is
// empty (forks, local dev) no ad markup is rendered at all.
export const ADSENSE_CLIENT = import.meta.env.PUBLIC_ADSENSE_CLIENT ?? '';

export const ADS_ENABLED = ADSENSE_CLIENT.length > 0;

export const AD_SLOTS = {
  sidebar: '7062749097',
  inline: '6356086362',
  inArticle: '7477596347',
};
