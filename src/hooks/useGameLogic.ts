import { useState, useCallback, useEffect } from 'react';
import type { GridState, Direction, Point } from '../types/game';
import {
    GRID_SIZE,
    createSmallBlock,
    getAllMatches,
    slideGrid,
    hasPossibleMatches
} from '../utils/gameUtils';
import { playSound } from '../utils/sounds';

export const useGameLogic = () => {
    const [smallBlocks, setSmallBlocks] = useState<GridState>(() =>
        Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null))
    );

    const [score, setScore] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [gameOver, setGameOver] = useState(false);

    // Get random empty position
    const getRandomEmptyPos = (grid: GridState): Point | null => {
        const empties: Point[] = [];
        for (let x = 0; x < GRID_SIZE; x++) {
            for (let y = 0; y < GRID_SIZE; y++) {
                if (!grid[x][y]) empties.push({ x, y });
            }
        }
        if (empties.length === 0) return null;
        return empties[Math.floor(Math.random() * empties.length)];
    };

    const spawnBlocksOnGrid = (grid: GridState, count: number): GridState => {
        const newGrid = grid.map(row => [...row]);
        for (let i = 0; i < count; i++) {
            const pos = getRandomEmptyPos(newGrid);
            if (pos) {
                newGrid[pos.x][pos.y] = createSmallBlock();
            }
        }
        return newGrid;
    };

    const resetGame = useCallback(() => {
        const emptyGrid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null));
        const initialGrid = spawnBlocksOnGrid(emptyGrid, Math.floor(Math.random() * 2) + 3); // 3 to 4 blocks
        setSmallBlocks(initialGrid);
        setScore(0);
        setGameOver(false);
        setIsProcessing(false);
    }, []);

    useEffect(() => {
        resetGame();
    }, [resetGame]);

    // Turn end check: Spawning and matching
    const endTurn = async (gridAfterSlide: GridState, dx: number, dy: number) => {
        setIsProcessing(true);

        // 1. New Spawn (Swipe resulted in move)
        const gridWithNewSpawn = spawnBlocksOnGrid(gridAfterSlide, 1);
        setSmallBlocks(gridWithNewSpawn);
        await new Promise(r => setTimeout(r, 150));

        // 2. Chain Reaction Matches
        let currentGrid = gridWithNewSpawn;
        let loop = true;

        while (loop) {
            const matches = getAllMatches(currentGrid);
            if (matches.length === 0) {
                loop = false;
                break;
            }

            playSound('match');
            setScore(s => s + matches.length * 100);

            const tempGrid = currentGrid.map(row => [...row]);
            matches.forEach(p => { tempGrid[p.x][p.y] = null; });
            setSmallBlocks(tempGrid);
            await new Promise(r => setTimeout(r, 250));

            const { newGrid: slidGrid } = slideGrid(tempGrid, dx, dy);

            // If sliding after matches actually moves things, update state and wait
            if (JSON.stringify(slidGrid) !== JSON.stringify(tempGrid)) {
                setSmallBlocks(slidGrid);
                currentGrid = slidGrid;
                await new Promise(r => setTimeout(r, 150));
            } else {
                currentGrid = tempGrid;
                loop = false;
            }
        }

        // 3. Check Game Over
        if (!hasPossibleMatches(currentGrid)) {
            setGameOver(true);
        }

        setIsProcessing(false);
    };

    const slide = useCallback((direction: Direction) => {
        if (isProcessing || gameOver) return;

        let dx = 0, dy = 0;
        if (direction === 'LEFT') dx = -1;
        if (direction === 'RIGHT') dx = 1;
        if (direction === 'UP') dy = -1;
        if (direction === 'DOWN') dy = 1;

        const { newGrid, moved } = slideGrid(smallBlocks, dx, dy);

        if (moved) {
            playSound('slide');
            setSmallBlocks(newGrid);
            // We moved, so we trigger the end-turn sequence (Spawn + Match)
            endTurn(newGrid, dx, dy);
        }
    }, [smallBlocks, isProcessing, gameOver]);

    return { smallBlocks, slide, score, gameOver, isProcessing, resetGame };
};