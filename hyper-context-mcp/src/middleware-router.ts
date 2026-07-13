export interface ExternalPayload {
  sourceSystem: string;
  dataType: string;
  rawPayload: Record<string, any>;
}

export interface TransformedContextNode {
  id: string;
  title: string;
  content: string;
  tags: string[];
}

export class MiddlewareRouter {
  /**
   * Routes external payload architectures into fluid hyper-context graph specifications.
   * This is our translation bridge to older web patterns (SaaS, APIs, standard databases).
   */
  static transformToContext(payload: ExternalPayload): TransformedContextNode {
    const { sourceSystem, dataType, rawPayload } = payload;
    
    // Normalize data points into semantic structures dynamically based on type
    const normalizedId = `${sourceSystem.toLowerCase()}-${rawPayload.id || Math.random().toString(36).substring(7)}`;
    const title = rawPayload.title || rawPayload.name || `Ingested ${dataType} from ${sourceSystem}`;
    
    // Build a coherent technical description out of unstructured object footprints
    const content = typeof rawPayload.content === "string" 
      ? rawPayload.content 
      : JSON.stringify(rawPayload, null, 2);

    const tags = [
      "ingested",
      sourceSystem.toLowerCase(),
      dataType.toLowerCase(),
      ...(rawPayload.tags || [])
    ];

    return {
      id: normalizedId,
      title,
      content,
      tags
    };
  }
}
