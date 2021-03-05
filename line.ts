namespace zoids {
    export class Line {
        constructor(public a: number, public b: number) {
        }
    }

    export class LineSegment {
        public get points() { return this._points; }

        constructor(private _points: Vector3[]) {
            this._points = this._points || [];
        }
    }

    export class LineShape {
        public get segments() { return this._segments; }

        constructor(private _segments: LineSegment[]) {
            this._segments = this._segments || [];
        }
    }
}