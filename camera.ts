namespace zoids {
    export enum CameraType {
        Orthographic,
        Perspective
    }

    export class Camera {
        private _pos: Vector3;
        private _rot: Vector3;
        private _view: Matrix;
        public viewport: Viewport;

        //% blockCombine block="type" callInDebugger
        public get type() { return this._type; }

        //% blockCombine block="pos" callInDebugger
        public get pos() { return this._pos; }
        public set pos(v) { this._pos.copyFrom(v); }

        //% blockCombine block="rot" callInDebugger
        public get rot() { return this._rot; }
        public set rot(v) { this._rot.copyFrom(v); }

        //% blockCombine block="world" callInDebugger
        public get view() { return this._view; }
        //% blockCombine block="proj" callInDebugger
        public get proj() { return this._proj; }
        // //% blockCombine block="viewProj" callInDebugger
        //public get viewProj() { return this._viewProj; }

        constructor(private _type: CameraType, private _proj: Matrix) {
            this._pos = Vector3.Zero();
            this._rot = Vector3.Zero();
            this._view = Matrix.Identity();
            this.viewport = new Viewport(0, 0, scene.screenWidth(), scene.screenHeight());
        }

        public recalc() {
            const rot = Quaternion.FromYawPitchRoll(this.rot.y, this.rot.x, this.rot.z);
            //Matrix.TransformationMatrix(this.viewport, this.
            Matrix.ComposeToRef(this._pos, rot, Vector3.One(), this._world);
            Matrix.MultiplyToRef(this._world, this._proj, this._viewProj);
        }

    }
}
