import type { GridState, Point, Block, BlockType } from '../types/game';

export const GRID_SIZE = 5;
export const COLORS = ['#FF3B30', '#007AFF', '#4CD964', '#FFCC00', '#5856D6'];

export const createBlock = (type: BlockType = 'small', color?: string): Block => ({
    id: Math.random().toString(36).substr(2, 9),
    type,
    color: color || COLORS[Math.floor(Math.random() * COLORS.length)],
});

export const getMatches = (grid: GridState): Point[][] => {
    const visited = new Set<string>();
    const matches: Point[][] = [];

    for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
            const block = grid[r][c];
            if (!block || visited.has(`${r},${c}`)) continue;

            const group: Point[] = [];
            const queue: Point[] = [{ r, c }];
            visited.add(`${r},${c}`);

            while (queue.length > 0) {
                const curr = queue.shift()!;
                group.push(curr);

                // 8 directions (orthogonal + diagonal)
                for (let dr = -1; dr <= 1; dr++) {
                    for (let dc = -1; dc <= 1; dc++) {
                        if (dr === 0 && dc === 0) continue;
                        const nr = curr.r + dr;
                        const nc = curr.c + dc;

                        if (
                            nr >= 0 && nr < GRID_SIZE &&
                            nc >= 0 && nc < GRID_SIZE &&
                            !visited.has(`${nr},${nc}`) &&
                            grid[nr][nc]?.color === block.color
                        ) {
                            visited.add(`${nr},${nc}`);
                            queue.push({ r: nr, c: nc });
                        }
                    }
                }
            }

            if (group.length >= 3) {
                matches.push(group);
            }
        }
    }
    return matches;
};
