import replace from "@rollup/plugin-replace";

const production = !process.env.ROLLUP_WATCH;
export default [
  replace({
    RTC: JSON.stringify(process.env.RTC),
    AUTH: JSON.stringify(process.env.AUTH),
    AUTH_URL: JSON.stringify(process.env.AUTH_URL),
    RTC_URL: JSON.stringify(process.env.RTC_URL),
    HANGOUTS: JSON.stringify(process.env.HANGOUTS),
  }),
  replace({
    ip: JSON.stringify(process.env.ip),
    PORT: JSON.stringify(process.env.PORT),
    ENV: JSON.stringify(process.env.NODE_ENV),
  }),
];
