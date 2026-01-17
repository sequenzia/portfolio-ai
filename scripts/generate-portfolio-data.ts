import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { parsePortfolioMarkdown } from "../src/lib/portfolio/parsePortfolio";

/**
 * Build-time script to generate portfolio data from markdown.
 * This ensures src/content/portfolio.md is the single source of truth.
 */
function generatePortfolioData() {
  try {
    // Use absolute paths relative to project root
    const projectRoot = join(__dirname, "..");
    const markdownPath = join(projectRoot, "src/content/portfolio.md");
    const outputPath = join(projectRoot, "src/lib/portfolio/data.ts");

    // Read and parse the markdown file
    console.log("📖 Reading portfolio.md...");
    const markdownContent = readFileSync(markdownPath, "utf-8");

    console.log("⚙️  Parsing portfolio content...");
    const parsed = parsePortfolioMarkdown(markdownContent);

    // Generate TypeScript code
    const output = `// AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
// This file is generated from src/content/portfolio.md
// To update portfolio content, edit portfolio.md and run: npm run dev or npm run build

import type { PortfolioContent } from "./types";

/**
 * Pre-parsed portfolio data.
 * This is a static export that can be imported by both client and server code.
 * To update this data, edit src/content/portfolio.md and run the parse script,
 * or manually update the values below.
 */
export const portfolioContent: PortfolioContent = ${JSON.stringify(parsed, null, 2)};
`;

    // Write the generated TypeScript file
    console.log("✍️  Writing generated data.ts...");
    writeFileSync(outputPath, output, "utf-8");

    console.log("✅ Generated portfolio data from src/content/portfolio.md");
  } catch (error) {
    console.error("❌ Error generating portfolio data:");
    if (error instanceof Error) {
      console.error(`   ${error.message}`);
      if (error.stack) {
        console.error(`\n${error.stack}`);
      }
    } else {
      console.error(error);
    }
    process.exit(1);
  }
}

// Run the script
generatePortfolioData();
