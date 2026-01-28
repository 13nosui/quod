import { useState, useCallback } from 'react';
import type { GridState, Direction } from '../types/game';
import { GRID_SIZE, createBlock, getMatches } from '../utils/gameUtils';
import { playSound } from '../utils/sounds';

export const useGameLogic = () => {
    const [grid, setGrid] = useState<GridState>(() => {
        const initialGrid: GridState = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null));
        for (let i = 0; i < 10; i++) {
            const row = Math.floor(Math.random() * GRID_SIZE);
            const col = Math.floor(Math.random() * GRID_SIZE);
            if (!initialGrid[row][col]) {
                initialGrid[row][col] = createBlock(Math.random() > 0.8 ? 'big' : 'small');
            }
        }
        return initialGrid;
    });

    const [score, setScore] = useState(0);

    const processMatches = useCallback((currentGrid: GridState): { newGrid: GridState, matchFound: boolean } => {
        const matches = getMatches(currentGrid);
        if (matches.length === 0) return { newGrid: currentGrid, matchFound: false };

        playSound('match');
        const newGrid = currentGrid.map(row => [...row]);
        let points = 0;

        matches.forEach(group => {
            points += group.length * 10;
            group.forEach(pt => {
                newGrid[pt.r][pt.c] = null;
            });
        });

        setScore(s => s + points);
        return { newGrid, matchFound: true };
    }, []);

    const slide = useCallback((direction: Direction) => {
        setGrid((prevGrid) => {
            const newGrid = prevGrid.map(row => [...row]);
            let moved = false;

            const move = (r: number, c: number, dr: number, dc: number) => {
                let currR = r;
                let currC = c;
                let nextR = r + dr;
                let nextC = c + dc;

                while (
                    nextR >= 0 && nextR < GRID_SIZE &&
                    nextC >= 0 && nextC < GRID_SIZE &&
                    !newGrid[nextR][nextC]
                ) {
                    newGrid[nextR][nextC] = newGrid[currR][currC];
                    newGrid[currR][currC] = null;
                    currR = nextR;
                    currC = nextC;
                    nextR = currR + dr;
                    nextC = currC + dc;
                    moved = true;
                }
            };

            if (direction === 'UP') {
                for (let c = 0; c < GRID_SIZE; c++) {
                    for (let r = 0; r < GRID_SIZE; r++) {
                        if (newGrid[r][c]) move(r, c, -1, 0);
                    }
                }
            } else if (direction === 'DOWN') {
                for (let c = 0; c < GRID_SIZE; c++) {
                    for (let r = GRID_SIZE - 1; r >= 0; r--) {
                        if (newGrid[r][c]) move(r, c, 1, 0);
                    }
                }
            } else if (direction === 'LEFT') {
                for (let r = 0; r < GRID_SIZE; r++) {
                    for (let c = 0; c < GRID_SIZE; c++) {
                        if (newGrid[r][c]) move(r, c, 0, -1);
                    }
                }
            } else if (direction === 'RIGHT') {
                for (let r = 0; r < GRID_SIZE; r++) {
                    for (let c = GRID_SIZE - 1; c >= 0; c--) {
                        if (newGrid[r][c]) move(r, c, 0, 1);
                    }
                }
            }

            const { newGrid: matchedGrid, matchFound } = processMatches(newGrid);
            if (moved || matchFound) playSound('slide');

            return moved || matchFound ? matchedGrid : prevGrid;
        });
    }, [processMatches]);

    const breakBlock = useCallback((row: number, col: number) => {
        setGrid((prevGrid) => {
            const block = prevGrid[row][col];
            if (!block || block.type !== 'big') return prevGrid;

            playSound('break');
            const newGrid = prevGrid.map(r => [...r]);
            newGrid[row][col] = null;

            const shards = Array(4).fill(null).map(() => createBlock('small', block.color));
            const neighbors = [
                { r: row, c: col },
                { r: row - 1, c: col },
                { r: row + 1, c: col },
                { r: row, c: col - 1 },
                { r: row, c: col + 1 }
            ].filter(loc => loc.r >= 0 && loc.r < GRID_SIZE && loc.c >= 0 && loc.c < GRID_SIZE && !newGrid[loc.r][loc.c]);

            shards.forEach((shard) => {
                if (neighbors.length > 0) {
                    const loc = neighbors.shift()!;
                    newGrid[loc.r][loc.c] = shard;
                }
            });

            const { newGrid: matchedGrid } = processMatches(newGrid);
            return matchedGrid;
        });
    }, [processMatches]);

    return { grid, slide, breakBlock, score };
};
