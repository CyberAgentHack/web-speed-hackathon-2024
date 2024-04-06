import { killAll, launch } from 'chrome-launcher';
import type { UserFlow } from 'lighthouse';
import lighthouse, { startFlow } from 'lighthouse';
import puppeteer from 'puppeteer';
import type { Page } from 'puppeteer';

import type { LighthouseFlowScore } from './types/lighthouse-flow-score';
import type { LighthousePageScore } from './types/lighthouse-page-score';

export const measurePage = async (url: string): Promise<LighthousePageScore> => {
  const chrome = await launch({
    chromeFlags: ['--headless', '--no-sandbox', '--hide-scrollbars'],
  });

  try {
    const result = await lighthouse(
      url,
      {
        logLevel: 'error',
        onlyAudits: [
          'cumulative-layout-shift',
          'first-contentful-paint',
          'largest-contentful-paint',
          'speed-index',
          'total-blocking-time',
        ],
        output: 'json',
        port: chrome.port,
      },
      {
        extends: 'lighthouse:default',
      },
    );

    return {
      cumulativeLayoutShift: result?.lhr?.audits['cumulative-layout-shift']?.score ?? 0,
      firstContentfulPaint: result?.lhr?.audits['first-contentful-paint']?.score ?? 0,
      largestContentfulPaint: result?.lhr?.audits['largest-contentful-paint']?.score ?? 0,
      speedIndex: result?.lhr?.audits['speed-index']?.score ?? 0,
      totalBlockingTime: result?.lhr?.audits['total-blocking-time']?.score ?? 0,
    };
  } finally {
    killAll();
  }
};

export const measureFlow = async (
  url: string,
  callback: (page: Page, flow: UserFlow) => Promise<void>,
): Promise<LighthouseFlowScore> => {
  const browser = await puppeteer.launch({
    args: ['--headless', '--no-sandbox', '--hide-scrollbars'],
  });

  try {
    const page = await browser.newPage();
    await page.goto(url);

    const flow = await startFlow(page, {
      config: {
        extends: 'lighthouse:default',
      },
      flags: {
        logLevel: 'error',
        onlyAudits: ['interaction-to-next-paint', 'total-blocking-time'],
        output: 'json',
      },
    });

    await callback(page, flow);

    const result = await flow.createFlowResult();
    const lhr = result?.steps?.at(-1)?.lhr;

    return {
      interactionToNextPaint: lhr?.audits['interaction-to-next-paint']?.score ?? 0,
      totalBlockingTime: lhr?.audits['total-blocking-time']?.score ?? 0,
    };
  } finally {
    await browser.close();
  }
};

export const calculatePageScore = (lighthouseScore: LighthousePageScore): number => {
  const score =
    lighthouseScore.firstContentfulPaint * 100 * 10 +
    lighthouseScore.speedIndex * 100 * 10 +
    lighthouseScore.largestContentfulPaint * 100 * 25 +
    lighthouseScore.totalBlockingTime * 100 * 30 +
    lighthouseScore.cumulativeLayoutShift * 100 * 25;

  return score / 100;
};

export const calculateFlowScore = (lighthouseScore: LighthouseFlowScore): number => {
  const score = lighthouseScore.totalBlockingTime * 50 * 25 + lighthouseScore.interactionToNextPaint * 50 * 25;

  return score / 50;
};
