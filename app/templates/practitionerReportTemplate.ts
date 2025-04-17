export const getPractitionerReportHTML = (
    firstName: string,
    content: string
  ) => `
  <html>
    <head>
      <style>
        body {
          font-family: Helvetica, sans-serif;
          font-size: 11px;
          color: #333;
          padding: 40px;
          line-height: 1.6;
        }
        h1, h2 {
          color: #111;
        }
        .title {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .subtitle {
          font-size: 12px;
          color: #555;
          margin-bottom: 20px;
        }
        .section-title {
          font-size: 13px;
          font-weight: bold;
          margin-top: 25px;
          margin-bottom: 5px;
          color: #111;
        }
        .highlight-box {
          background: #f0f7ff;
          padding: 10px;
          margin: 20px 0;
          border-left: 4px solid #0099ff;
        }
        ul {
          padding-left: 20px;
        }
        li {
          margin-bottom: 4px;
        }
        .emoji-title {
          font-weight: bold;
          color: #0066cc;
          margin-bottom: 8px;
        }
        pre {
          white-space: pre-wrap;
          font-family: inherit;
        }
      </style>
    </head>
    <body>
      <div class="title">Client Assessment Report for ${firstName}</div>
      <div class="subtitle">Prepared by DreamScape AI</div>
      <pre>${content}</pre>
    </body>
  </html>
  `;
  