namespace zoids {
    export type Point = { x: number, y: number, z: number };
    export type Line = Point[];
    export type Polygon = Line[];

    export class polygons {

        public static Box: Polygon = [
            // Top
            [
                {x:-0.5, y:0.5, z:-0.5}, {x:0.5, y:0.5, z:-0.5},
                {x:0.5, y:0.5, z:0.5}, {x:-0.5, y:0.5, z:0.5},
                {x:-0.5, y:0.5, z:-0.5},
            ],
            // Bottom
            [
                {x:-0.5, y:-0.5, z:-0.5}, {x:0.5, y:-0.5, z:-0.5},
                {x:0.5, y:-0.5, z:0.5}, {x:-0.5, y:-0.5, z:0.5},
                {x:-0.5, y:-0.5, z:-0.5},
            ],
            // Sides
            [
                {x:-0.5, y:0.5, z:-0.5}, {x:-0.5, y:-0.5, z:-0.5}
            ],
            [
                {x:0.5, y:0.5, z:-0.5}, {x:0.5, y:-0.5, z:-0.5}
            ],
            [
                {x:0.5, y:0.5, z:0.5}, {x:0.5, y:-0.5, z:0.5}
            ],
            [
                {x:-0.5, y:0.5, z:0.5}, {x:-0.5, y:-0.5, z:0.5}
            ],
        ]
    }
}