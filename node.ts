namespace zoids {
    export class Node {
        public update() {}
        public render() {}
    }


    export class Face {
        constructor(public a: number, public b: number, public c: number) {
        }
    }

    export class Mesh {
        private verts: Vector3[];
        private faces: Face[];
        private _material: Material;

        public get material() { return this._material; }

        constructor() {
            this.verts = [];
            this.faces = [];
            this._material = new Material();
        }
    }
}
