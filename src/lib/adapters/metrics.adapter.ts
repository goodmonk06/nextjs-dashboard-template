import { logger } from "../logger";

export interface MetricPayload {
  name: string;
  value: number;
  tags?: Record<string, string>;
  timestamp?: Date;
}

export interface IMetricsAdapter {
  recordCounter(name: string, value?: number, tags?: Record<string, string>): void;
  recordGauge(name: string, value: number, tags?: Record<string, string>): void;
  recordHistogram(name: string, value: number, tags?: Record<string, string>): void;
}

// In-memory implementation for now
export class InMemoryMetricsAdapter implements IMetricsAdapter {
  private metrics: Map<string, MetricPayload[]> = new Map();

  recordCounter(name: string, value: number = 1, tags?: Record<string, string>): void {
    this.record({ name, value, tags, timestamp: new Date() });
    logger.debug("Counter recorded", { name, value, tags });
  }

  recordGauge(name: string, value: number, tags?: Record<string, string>): void {
    this.record({ name, value, tags, timestamp: new Date() });
    logger.debug("Gauge recorded", { name, value, tags });
  }

  recordHistogram(name: string, value: number, tags?: Record<string, string>): void {
    this.record({ name, value, tags, timestamp: new Date() });
    logger.debug("Histogram recorded", { name, value, tags });
  }

  private record(metric: MetricPayload): void {
    const existing = this.metrics.get(metric.name) || [];
    existing.push(metric);

    // Keep only last 1000 metrics per name to avoid memory issues
    if (existing.length > 1000) {
      existing.shift();
    }

    this.metrics.set(metric.name, existing);
  }

  getMetrics(name: string): MetricPayload[] {
    return this.metrics.get(name) || [];
  }

  getAllMetrics(): Map<string, MetricPayload[]> {
    return new Map(this.metrics);
  }
}

// Singleton instance
export const metricsAdapter: IMetricsAdapter = new InMemoryMetricsAdapter();
