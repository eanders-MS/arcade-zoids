namespace zoids {
    export class Transform {
        private _pos: Vector3;
        private _rot: Vector3;
        private _scale: Vector3;
        private _mat: Matrix;

        //% blockCombine block="pos" callInDebugger
        public get pos() { return this._pos; }
        public set pos(v) { this._pos.copyFrom(v); }

        //% blockCombine block="rot" callInDebugger
        public get rot() { return this._rot; }
        public set rot(v) { this._rot.copyFrom(v); }

        //% blockCombine block="scale" callInDebugger
        public get scale() { return this._scale; }
        public set scale(v) { this._scale.copyFrom(v); }

        constructor() {
            this._pos = Vector3.Zero();
            this._rot = Vector3.Zero();
            this._scale = Vector3.One();
            this._mat = Matrix.Identity();
        }
    }
}
