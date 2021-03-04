namespace zoids {
    export class Mesh {
        private verts: Vector3[];
        private faces: Face[];
        private material: Material;

        constructor() {
            this.verts = [];
            this.faces = [];
            this.material = Material.Default();
        }
    }

}