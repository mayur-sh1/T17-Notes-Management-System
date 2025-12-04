import { NoteEditChange } from '../types';

export interface ConflictResolution {
  resolved: boolean;
  content: string;
  conflicts?: Array<{
    position: number;
    change: NoteEditChange;
    conflictingChange: NoteEditChange;
  }>;
}

/**
 * Resolve conflicts between simultaneous edits
 * Uses Operational Transform (OT) principles
 */
export const resolveConflicts = (
  baseContent: string,
  changes1: NoteEditChange[],
  changes2: NoteEditChange[]
): ConflictResolution => {
  // Sort changes by position
  const sorted1 = [...changes1].sort((a, b) => a.position - b.position);
  const sorted2 = [...changes2].sort((a, b) => a.position - b.position);

  let content = baseContent;
  let offset1 = 0;
  let offset2 = 0;
  const conflicts: Array<{
    position: number;
    change: NoteEditChange;
    conflictingChange: NoteEditChange;
  }> = [];

  // Apply changes sequentially, adjusting positions
  for (const change of sorted1) {
    const adjustedPosition = change.position + offset1;

    if (change.type === 'insert' && change.content) {
      content = content.slice(0, adjustedPosition) + change.content + content.slice(adjustedPosition);
      offset1 += change.content.length;
      offset2 += change.content.length;
    } else if (change.type === 'delete' && change.length) {
      content = content.slice(0, adjustedPosition) + content.slice(adjustedPosition + change.length);
      offset1 -= change.length;
      offset2 -= change.length;
    }
  }

  // Check for conflicts with second set of changes
  for (const change of sorted2) {
    const adjustedPosition = change.position + offset2;

    // Simple conflict detection: overlapping edits
    const hasConflict = sorted1.some(
      (c1) =>
        Math.abs(c1.position - change.position) < 10 &&
        (c1.type === 'delete' || change.type === 'delete')
    );

    if (hasConflict) {
      conflicts.push({
        position: adjustedPosition,
        change: sorted1.find((c) => Math.abs(c.position - change.position) < 10)!,
        conflictingChange: change,
      });
    } else {
      // Apply non-conflicting changes
      if (change.type === 'insert' && change.content) {
        content = content.slice(0, adjustedPosition) + change.content + content.slice(adjustedPosition);
        offset2 += change.content.length;
      } else if (change.type === 'delete' && change.length) {
        content = content.slice(0, adjustedPosition) + content.slice(adjustedPosition + change.length);
        offset2 -= change.length;
      }
    }
  }

  return {
    resolved: conflicts.length === 0,
    content,
    conflicts: conflicts.length > 0 ? conflicts : undefined,
  };
};

