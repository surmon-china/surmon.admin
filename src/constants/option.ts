/**
 * @file Option interface
 * @author Surmon <https://github.com/surmon-china>
 */

/** 设置 */
export interface Option {
  title: string;
  sub_title: string;
  description: string;
  keywords: Array<string>;
  site_url: string;
  site_email: string;
  site_icp: string;
  blacklist: {
    ips: Array<string>;
    mails: Array<string>;
    keywords: Array<string>;
  };
  meta: {
    likes: number;
  };
  ad_config: string;
  update_at: string;
}
