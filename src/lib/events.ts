import { logger } from "./logger";

// Domain Events
export type DomainEvent = {
  id: string;
  type: string;
  timestamp: Date;
  data: Record<string, any>;
  metadata?: Record<string, any>;
};

// Specific Event Types
export type UserCreatedEvent = DomainEvent & {
  type: "user.created";
  data: {
    userId: string;
    email: string;
    organizationId?: string;
  };
};

export type UserUpdatedEvent = DomainEvent & {
  type: "user.updated";
  data: {
    userId: string;
    changes: Record<string, any>;
  };
};

export type UserDeletedEvent = DomainEvent & {
  type: "user.deleted";
  data: {
    userId: string;
  };
};

export type OrganizationCreatedEvent = DomainEvent & {
  type: "organization.created";
  data: {
    organizationId: string;
    name: string;
    slug: string;
  };
};

export type OrganizationUpdatedEvent = DomainEvent & {
  type: "organization.updated";
  data: {
    organizationId: string;
    changes: Record<string, any>;
  };
};

export type TeamCreatedEvent = DomainEvent & {
  type: "team.created";
  data: {
    teamId: string;
    organizationId: string;
    name: string;
  };
};

// Event Handler type
export type EventHandler<T extends DomainEvent = DomainEvent> = (
  event: T
) => void | Promise<void>;

// Event Bus
class EventBus {
  private handlers: Map<string, EventHandler[]> = new Map();

  on<T extends DomainEvent>(eventType: string, handler: EventHandler<T>): void {
    const handlers = this.handlers.get(eventType) || [];
    handlers.push(handler as EventHandler);
    this.handlers.set(eventType, handlers);
  }

  off<T extends DomainEvent>(eventType: string, handler: EventHandler<T>): void {
    const handlers = this.handlers.get(eventType) || [];
    const index = handlers.indexOf(handler as EventHandler);
    if (index > -1) {
      handlers.splice(index, 1);
    }
  }

  async emit(event: DomainEvent): Promise<void> {
    const handlers = this.handlers.get(event.type) || [];

    logger.debug("Emitting event", {
      eventType: event.type,
      eventId: event.id,
      handlersCount: handlers.length,
    });

    for (const handler of handlers) {
      try {
        await handler(event);
      } catch (error) {
        logger.error(`Error handling event ${event.type}`, error, {
          eventId: event.id,
        });
      }
    }
  }
}

export const eventBus = new EventBus();

// Helper to create events
export function createEvent<T extends DomainEvent>(
  type: string,
  data: T["data"],
  metadata?: Record<string, any>
): T {
  return {
    id: crypto.randomUUID(),
    type,
    timestamp: new Date(),
    data,
    metadata,
  } as T;
}
