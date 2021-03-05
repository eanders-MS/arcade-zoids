namespace zoids {
    export class Camera {
        private _pos: Vector3;
        private _rot: Quaternion;
        private _world: Matrix;

        public get pos() { return this._pos; }
        public set pos(v) { this._pos.copyFrom(v); }

        public get rot() { return this._rot; }
        public set rot(v) { this._rot.copyFrom(v); }

        public get world() { return this._world; }
        public get proj() { return this._proj; }

        constructor(private _proj: Matrix) {
            this._world = Matrix.Identity();
        }

        public recalc() {
            
        }

    }
}
