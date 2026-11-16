import { createContext, useContext } from 'react';

/**
 * Site-wide values: current texts (`t`), language switcher, viewport flags
 * and navigation helpers (`goTo`, `book`).
 */
export const SiteContext = createContext(null);

export const useSite = () => useContext(SiteContext);
