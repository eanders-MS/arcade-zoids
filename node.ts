namespace zoids {
    export class Node {

    }

    export class TransformNode {
        private _pos: Vector3;
        private _rot: Quaternion;

        public get pos() { return this._pos; }
        public set pos(v) { this._pos.copyFrom(v); }

        public get rot() { return this._rot; }
        public set rot(v) { this._rot.copyFrom(v); }

        constructor() {
            this._pos = Vector3.Zero();
            this._rot = Quaternion.Identity();
        }
    }
}