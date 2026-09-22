import { createAction } from '@reduxjs/toolkit';

// Dispatched once at startup with whatever was read from storage. Each slice
// decides for itself which part of the payload it accepts, so adding a new
// persisted slice never touches the loading code.
export const hydrate = createAction('app/hydrate');
