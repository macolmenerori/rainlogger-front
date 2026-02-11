import { authHandlers } from './handlers/authHandlers';
import { rainlogHandlers } from './handlers/rainlogHandlers';

export const handlers = [...authHandlers, ...rainlogHandlers];
