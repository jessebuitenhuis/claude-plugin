const EVENT_SHAPED = /^[A-Z][A-Za-z0-9]+$/;

/** A then-entry that reads like an event id rather than a prose assertion. */
export const looksLikeEvent = (entry: string): boolean =>
  EVENT_SHAPED.test(entry);
