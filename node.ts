namespace zoids {
    let IdSequence = 0;

    export class Node {
        private _id: number;
        private _transform: Transform;
        private _children: Node[];
        private _parent: Node;
        private _world: Matrix;

        //% blockCombine block="id" callInDebugger
        public get id() { return this._id; }

        //% blockCombine block="transform" callInDebugger
        public get transform() { return this._transform; }

        public get children() { return this._children; }

        //% blockCombine block="parent" callInDebugger
        public get parent() { return this._parent; }
        public set parent(v: Node) {
            if (this._parent) {
                this._parent.removeChild(this);
            }
            if (v) {
                v.addChild(this);
            }
        }

        //% blockCombine block="world" callInDebugger
        public get world() {
            const rot = Quaternion.FromYawPitchRoll(this._transform.rot.y, this._transform.rot.x, this._transform.rot.z);
            Matrix.ComposeToRef(this._transform.pos, rot, this._transform.scale, this._world);
            if (this.parent) {
                Matrix.MultiplyToRef(this._world, this.parent.world, this._world);
            }
            return this._world;
        }

        constructor(public scene: Scene) {
            this._id = ++IdSequence;
            this._children = [];
            this._transform = new Transform();
            this._world = new Matrix();
        }

        public update() {}

        public draw(camera: Camera) {}

        public addChild(child: Node) {
            if (child._parent) throw "aack!";
            child._parent = this;
            this._children.push(child);
        }

        public removeChild(child: Node) {
            if (child._parent) {
                if (child._parent !== this) throw "aack!";
                child._parent = null;
                this._children = this._children.filter(ch => ch.id !== child.id);
            }
        }
    }

    export enum HorizontalJustification {
        Left,
        Center,
        Right
    }

    export enum VerticalJustification {
        Top,
        Center,
        Bottom
    }

    export class TextNode extends Node {
        public horzJust: HorizontalJustification;
        public vertJust: VerticalJustification;

        constructor(public text: string, public color: number, scene: Scene) {
            super(scene);
            this.horzJust = HorizontalJustification.Left;
            this.vertJust = VerticalJustification.Top;
        }

        private foreachLine(cb: (p0: Vector3, p1: Vector3) => void) {
            const p0 = Vector3.Zero();
            const p1 = Vector3.Zero();

            let ofs = new Vector3(this.transform.pos.x, this.transform.pos.y)
            switch (this.horzJust) {
                case HorizontalJustification.Left: {
                    break;
                }
                case HorizontalJustification.Center: {
                    ofs.x -= (this.text.length * (font.width + 1)) >> 1;
                    break;
                }
                case HorizontalJustification.Right: {
                    ofs.x -= this.text.length * (font.width + 1);
                    break;
                }
            }
            switch (this.vertJust) {
                case VerticalJustification.Top: {
                    break;
                }
                case VerticalJustification.Center: {
                    ofs.y -= font.height >> 1;
                    break;
                }
                case VerticalJustification.Bottom: {
                    ofs.y -= font.height;
                    break;
                }
            }
            for (let iCh = 0; iCh < this.text.length; ++iCh) {
                const ch = this.text.charAt(iCh);
                const glyph = font.glyphs[ch];
                if (glyph) {
                    for (let iSeg = 0; iSeg < glyph.length; ++iSeg) {
                        const seg = glyph[iSeg];
                        for (let iPt = 0; iPt < seg.length - 1; ++iPt) {
                            const pt0 = seg[iPt];
                            const pt1 = seg[iPt + 1];
                            p0.set(
                                ofs.x + pt0.x,
                                ofs.y + pt0.y,
                                ofs.z + pt0.z);
                            p1.set(
                                ofs.x + pt1.x,
                                ofs.y + pt1.y,
                                ofs.z + pt1.z);
                            cb(p0, p1);
                        }
                    }
                }
                ofs.x += font.width + 1;
            }
        }

        draw(camera: Camera) {
            const img = scene.backgroundImage();
            if (camera.type === CameraType.Orthographic) {
                this.foreachLine((p0, p1) => img.drawLine(p0.x, p0.y, p1.x, p1.y, this.color));
            } else if (camera.type === CameraType.Perspective) {
                const wvp = Matrix.Multiply(this.world, camera.viewProj);
                this.foreachLine((p0, p1) => {
                    p0.transform(wvp);
                    p1.transform(wvp);
                    img.drawLine(p0.x, p0.y, p1.x, p1.y, this.color);
                });
            }
        }
    }

    export class PolygonNode extends Node {

        constructor(private poly: Polygon, private color: number, scene: Scene) {
            super(scene);
        }

        private foreachLine(cb: (p0: Vector3, p1: Vector3) => void) {
            const p0 = Vector3.Zero();
            const p1 = Vector3.Zero();
            const poly = this.poly;
            for (let iSeg = 0; iSeg < poly.length; ++iSeg) {
                const seg = poly[iSeg];
                for (let iPt = 0; iPt < seg.length - 1; ++iPt) {
                    const pt0 = seg[iPt];
                    const pt1 = seg[iPt + 1];
                    p0.setFromPoint(pt0);
                    p1.setFromPoint(pt1);
                    cb(p0, p1);
                }
            }
        }

        draw(camera: Camera) {
            const img = scene.backgroundImage();
            if (camera.type === CameraType.Perspective) {
                let wvp = Matrix.Multiply(this.world, camera.viewProj);
                this.foreachLine((p0, p1) => {
                    p0.transform(wvp);
                    p1.transform(wvp);
                    img.drawLine(p0.x, p0.y, p1.x, p1.y, this.color);
                });
            }
        }
    }

    export class ShapeNode extends Node {

        constructor(private shape: Shape, private color: number, scene: Scene) {
            super(scene);
        }

        draw(camera: Camera) {
            const img = scene.backgroundImage();
            if (camera.type === CameraType.Perspective) {
                const wvp = Matrix.Multiply(this.world, camera.viewProj);
                const a = Vector3.Zero();
                const b = Vector3.Zero();
                const c = Vector3.Zero();
                this.shape.faces.forEach(face => {
                    // Perf issue: interior lines are drawn multiple times.
                    // Could keep a global "this line drawn?" buffer.
                    const pa = this.shape.poly[face.a.i][face.a.j];
                    const pb = this.shape.poly[face.b.i][face.b.j];
                    const pc = this.shape.poly[face.c.i][face.c.j];
                    a.setFromPoint(pa);
                    b.setFromPoint(pb);
                    c.setFromPoint(pc);
                    a.transform(wvp);
                    b.transform(wvp);
                    c.transform(wvp);
                    const normal = Vector3.Cross(Vector3.Subtract(a, b), Vector3.Subtract(b, c));
                    const d = Vector3.Dot(camera.forward, normal);
                    if (d > 0) {
                        img.drawLine(a.x, a.y, b.x, b.y, this.color);
                        img.drawLine(b.x, b.y, c.x, c.y, this.color);
                    }
                });
            }
            this.children.forEach(child => child.draw(camera));

        }
    }
}