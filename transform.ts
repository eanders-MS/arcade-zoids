namespace zoids {
    export class Transform {
        private _pos: Vector3;
        private _rot: Quaternion;
        private _scale: Vector3;
        private _mat: Matrix;

        public get pos() { return this._pos; }
        public set pos(v) { this._pos.copyFrom(v); }

        public get rot() { return this._rot; }
        public set rot(v) { this._rot.copyFrom(v); }

        public get scale() { return this._scale; }
        public set scale(v) { this._scale.copyFrom(v); }

        constructor() {
            this._pos = Vector3.Zero();
            this._rot = Quaternion.Identity();
            this._mat = Matrix.Identity();
        }

        public computeWorldMatrix(): Matrix {
            return Matrix.ComposeToRef(this, this._mat);
        }
    }
}
