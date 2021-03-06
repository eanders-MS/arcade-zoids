namespace zoids {
    export enum CameraType {
        Orthographic,
        Perspective
    }

    export class Camera {
        private _pos: Vector3;
        private _rot: Quaternion;
        private _world: Matrix;

        //% blockCombine block="type" callInDebugger
        public get type() { return this._type; }

        //% blockCombine block="pos" callInDebugger
        public get pos() { return this._pos; }
        public set pos(v) { this._pos.copyFrom(v); }

        //% blockCombine block="rot" callInDebugger
        public get rot() { return this._rot; }
        public set rot(v) { this._rot.copyFrom(v); }

        //% blockCombine block="world" callInDebugger
        public get world() { return this._world; }
        //% blockCombine block="proj" callInDebugger
        public get proj() { return this._proj; }
        //% blockCombine block="viewProj" callInDebugger
        public get viewProj() { return this._proj; } // todo

        constructor(private _type: CameraType, private _proj: Matrix) {
            this._world = Matrix.Identity();
        }

        public recalc() {
            
        }

    }
}
