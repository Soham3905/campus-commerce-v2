/**
 * Shared in-memory drag state for HTML5 Drag & Drop.
 * 
 * Note: The HTML5 Drag & Drop specification blocks `e.dataTransfer.getData()`
 * during `dragover` events for security reasons. This module-level state ensures
 * that Panel 2 (Canvas) can reliably inspect `draggedType` during `dragover`
 * to calculate debounced nesting validation (green vs red borders).
 */

export interface ActiveDragPayload {
  source: string;
  id: string;
  type: string;
  name: string;
  category: string;
  config: any;
  previewColor?: string;
  isExisting?: boolean;
  itemId?: string;
  item?: any;
}

let currentDragPayload: ActiveDragPayload | null = null;

export function setActiveDragPayload(payload: ActiveDragPayload | null) {
  currentDragPayload = payload;
}

export function getActiveDragPayload(): ActiveDragPayload | null {
  return currentDragPayload;
}
