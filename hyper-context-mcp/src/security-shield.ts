import * as crypto from "crypto";

export class SecurityShieldL7 {
  // A master shared secret key used to generate valid packet signatures between your sibling nodes
  private static MASTER_CLUSTER_SECRET = process.env.CLUSTER_SECRET || "super-secure-military-fallback-token-xyz";

  /**
   * Sanitizes raw text inputs against code injection or script execution tricks.
   */
  public static sanitizeInput(text: string): string {
    if (!text) return text;
    return text
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/['"`;\-]/g, ""); // Strip out common database and shell breaking characters
  }

  /**
   * Generates a cryptographic signature for outgoing payloads.
   */
  public static generateSignature(payload: any): string {
    const signer = crypto.createHmac("sha256", this.MASTER_CLUSTER_SECRET);
    signer.update(JSON.stringify(payload));
    return signer.digest("hex");
  }

  /**
   * Verifies an incoming Layer 7 cryptographic signature to prove the packet 
   * was actually sent by a trusted sibling cell and hasn't been altered in transit.
   */
  public static verifyPacketAuthenticity(payload: any, signature: string): boolean {
    if (!signature) return false;

    // Re-hash the payload data using our cluster secret
    const computedSignature = this.generateSignature(payload);

    try {
      // Use constant-time comparison to prevent timing attacks
      return crypto.timingSafeEqual(Buffer.from(computedSignature), Buffer.from(signature));
    } catch (e) {
      return false; // If lengths differ, timingSafeEqual throws an error
    }
  }
}
