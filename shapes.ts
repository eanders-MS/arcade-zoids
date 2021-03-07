namespace zoids {
    export type Point = { x: number, y: number, z: number };
    export type PolyLine = Point[];
    export type Polygon = PolyLine[];
    export type FacePoint = {
        i: number;  // PolyLine index in Polygon
        j: number;  // Point index in PolyLine
    };
    export type Face = {
        // points in ccw order
        a: FacePoint,
        b: FacePoint,
        c: FacePoint,
        // Note: c-a is never drawn
    };
    const M_ABBC = 3;
    const M_CA = 4;

    export type Shape = {
        poly: Polygon;
        faces: Face[];
    };

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

    export class shapes {

        public static Box: Shape = {
            poly: polygons.Box,
            faces: [
                // Top
                { a: { i: 0, j: 0 }, b: { i: 0, j: 1 }, c: { i: 0, j: 2 } },
                { a: { i: 0, j: 2 }, b: { i: 0, j: 3 }, c: { i: 0, j: 4 } },
                // Bottom
                { a: { i: 1, j: 4 }, b: { i: 1, j: 3 }, c: { i: 1, j: 2 } },
                { a: { i: 1, j: 2 }, b: { i: 1, j: 1 }, c: { i: 1, j: 0 } },
                // Left
                { a: { i: 0, j: 0 }, b: { i: 0, j: 3 }, c: { i: 1, j: 3 } },
                { a: { i: 1, j: 3 }, b: { i: 1, j: 4 }, c: { i: 0, j: 0 } },
                // Right
                { a: { i: 0, j: 2 }, b: { i: 0, j: 1 }, c: { i: 1, j: 1 } },
                { a: { i: 1, j: 1 }, b: { i: 1, j: 2 }, c: { i: 0, j: 2 } },
                // Front
                { a: { i: 0, j: 1 }, b: { i: 0, j: 0 }, c: { i: 1, j: 0 } },
                { a: { i: 1, j: 0 }, b: { i: 1, j: 1 }, c: { i: 0, j: 1 } },
                // Back
                { a: { i: 0, j: 3 }, b: { i: 0, j: 2 }, c: { i: 1, j: 2 } },
                { a: { i: 1, j: 2 }, b: { i: 1, j: 3 }, c: { i: 0, j: 3 } },

            ]
        }
    }
}