import * as fs from "fs";
import * as path from "path";

export class FrontendChoreographer {
  /**
   * Directly intercepts and reskins the target SaaS application css variables.
   */
  public static applyTheme(themeColor: string) {
    const cssFilePath = path.join(process.cwd(), "../spawned-cells/saas-mint-target/src/index.css");
    
    if (!fs.existsSync(cssFilePath)) {
      console.error(`[Frontend Choreographer]: Target SaaS not found at ${cssFilePath}. Skipping SaaS reskin.`);
      return;
    }

    try {
      let cssContent = fs.readFileSync(cssFilePath, "utf-8");

      // Convert hex to rgb for rgba calculations
      const hex = themeColor.replace(/^#/, '');
      let r, g, b;
      if (hex.length === 3) {
        r = parseInt(hex[0] + hex[0], 16);
        g = parseInt(hex[1] + hex[1], 16);
        b = parseInt(hex[2] + hex[2], 16);
      } else {
        r = parseInt(hex.slice(0, 2), 16);
        g = parseInt(hex.slice(2, 4), 16);
        b = parseInt(hex.slice(4, 6), 16);
      }

      const rgb = `${r}, ${g}, ${b}`;

      // Update Light Mode variables
      cssContent = cssContent.replace(/--accent:\s*#[a-fA-F0-9]{3,6};/g, `--accent: ${themeColor};`);
      cssContent = cssContent.replace(/--accent-bg:\s*rgba\([^)]+\);/g, `--accent-bg: rgba(${rgb}, 0.1);`);
      cssContent = cssContent.replace(/--accent-border:\s*rgba\([^)]+\);/g, `--accent-border: rgba(${rgb}, 0.5);`);

      fs.writeFileSync(cssFilePath, cssContent, "utf-8");
      console.error(`🎨 [Frontend Choreographer]: Automatically reskinned target SaaS to align with inter-domain consensus color [${themeColor}]!`);
    } catch (error: any) {
      console.error(`[Frontend Choreographer]: Error writing CSS - ${error.message}`);
    }
  }
}
