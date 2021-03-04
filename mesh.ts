namespace zoids {
    export class Mesh {
        private verts: Vector3[];
        private faces: Face[];
        private _material: Material;

        public get material() { return this._material; }

        constructor() {
            this.verts = [];
            this.faces = [];
            this._material = Material.White();
        }
    }

}