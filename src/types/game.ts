export type BlockType = 'big' | 'small';

export interface Block {
    id: string;
    type: BlockType;
    color: string;
}

export type GridState = (Block | null)[][];

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface Point {
    r: number;
    c: number;
}
