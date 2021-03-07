namespace zoids {
    export enum CameraType {
        Orthographic,
        Perspective
    }

    export class Camera {
        private _pos: Vector3;
        private _rot: Vector3;
        private _view: Matrix;
        private _world: Matrix;
        private _viewProj: Matrix;
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
        public get viewProj() { return this._viewProj; }

        constructor(private _type: CameraType, private _proj: Matrix) {
            this._pos = Vector3.Zero();
            this._rot = Vector3.Zero();
            this._view = Matrix.Identity();
            this._world = Matrix.Identity();
            this._viewProj = Matrix.Identity();
            this.viewport = new Viewport(0, 0, scene.screenWidth(), scene.screenHeight());
        }

        public recalc() {
            //const rot = Quaternion.FromYawPitchRoll(this.rot.y, this.rot.x, this.rot.z);
            //Matrix.ComposeToRef(this._pos, rot, Vector3.One(), this._world);
            //Matrix.InvertToRef(this._world, this._view);
            //Matrix.MultiplyToRef(this._view, this._proj, this._viewProj);
            Matrix.MultiplyToRef(Matrix.Identity(), this._proj, this._viewProj);

            const zmin = 0;
            const zmax = 1;

            const cw = this.viewport.width;
            const ch = this.viewport.height;
            const cx = this.viewport.x;
            const cy = this.viewport.y;

            const viewportMat = Matrix.FromValues(
                cw / 2.0, 0.0, 0.0, 0.0,
                0.0, ch / 2.0, 0.0, 0.0,
                0.0, 0.0, zmax - zmin, 0.0,
                cx + cw / 2.0, ch / 2.0 + cy, zmin, 1.0);

            Matrix.MultiplyToRef(this._viewProj, viewportMat, this._viewProj);


        }

    }
}
