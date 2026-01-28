import { Block as BlockComp } from './Block';
import type { GridState } from '../types/game';

interface GridProps {
    grid: GridState;
    onBlockClick: (row: number, col: number) => void;
}

export const Grid = ({ grid, onBlockClick }: GridProps) => {
    return (
        <div
            className="grid grid-cols-5 grid-rows-5 gap-1 p-2 bg-white/5 border-2 border-black/10 rounded-lg shadow-inner overflow-hidden"
            style={{
                width: 'min(90vw, 500px)',
                height: 'min(90vw, 500px)',
            }}
        >
            {grid.map((row, r) => (
                row.map((block, c) => (
                    <div key={`${r}-${c}`} className="flex items-center justify-center bg-black/5 rounded-sm overflow-hidden">
                        {block && (
                            <BlockComp
                                block={block}
                                row={r}
                                col={c}
                                onClick={() => onBlockClick(r, c)}
                            />
                        )}
                    </div>
                ))
            ))}
        </div>
    );
};
