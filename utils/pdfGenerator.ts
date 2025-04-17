import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs/promises';

export const generateStyledPDF = async (
  htmlContent: string,
  filename: string = 'report.pdf'
): Promise<Buffer> => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  await page.setContent(htmlContent, {
    waitUntil: 'domcontentloaded',
  });

  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '40px', bottom: '40px', left: '40px', right: '40px' },
    path: path.resolve('public', filename), 
  });

  await browser.close();
  return pdfBuffer;
};
