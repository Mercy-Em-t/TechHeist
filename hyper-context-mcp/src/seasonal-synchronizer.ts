import { BiochemicalBus, BiochemicalHormone } from "./biochemical-bus.js";

export interface SeasonalPlaybook {
  season: string;
  themeColor: string;
  promotionalFocus: string;
  regionalInsights: string[];
}

export class SeasonalSynchronizer {
  private static localFindings: Record<string, string[]> = {
    "christmas": ["Spike in multi-vendor retail checkout volume", "High mobile money transactional density in East Africa"],
    "easter": ["Increased family travel routing demands", "High demand for localized service marketplace booking"],
    "new_years": ["Heavy midnight server-traffic bursts", "Focus on renewal, tracking systems reset configurations"]
  };

  /**
   * Initiates an inter-domain calendar commune. 
   * Secretes a seasonal proposal into the global network stream to gather peer findings.
   */
  public static initiateCommune(seasonName: string, originCellId: string) {
    const normalizedSeason = seasonName.toLowerCase().trim();
    const insights = this.localFindings[normalizedSeason] || ["Standard seasonal cycle flagged"];

    console.error(`\n📅 [Seasonal Synchronizer]: Opening collective forum for season: [${normalizedSeason.toUpperCase()}]`);

    BiochemicalBus.secreteHormone("SEASONAL_COMMUNE_PROPOSAL", originCellId, {
      season: normalizedSeason,
      suggestedMotif: normalizedSeason === "christmas" ? "#dc2626" : normalizedSeason === "easter" ? "#f59e0b" : "#10b981",
      findingsPayload: insights
    });
  }

  /**
   * Processes a proposal or feedback received from a sister domain, 
   * blending cross-border insights to form a unified presentation strategy.
   */
  public static processPeerProposal(hormone: BiochemicalHormone, localCellId: string): SeasonalPlaybook | null {
    const { season, suggestedMotif, findingsPayload } = hormone.payload;
    
    console.error(`🫱🏼🫲🏼 [Commune Synergy]: Absorbed structural findings for ${season} from sister plant [${hormone.originCellId}]`);

    // Merge our local data with their incoming insights to form an elite joint strategy
    const ourInsights = this.localFindings[season] || [];
    const absoluteInsights = Array.from(new Set([...ourInsights, ...findingsPayload]));

    // Generate the finalized unified playbook blueprint
    return {
      season: season.toUpperCase(),
      themeColor: suggestedMotif,
      promotionalFocus: season === "christmas" ? "Multi-Vendor Marketplace Mega Drops" : "Localized Logistic Routing Safaris",
      regionalInsights: absoluteInsights
    };
  }
}
