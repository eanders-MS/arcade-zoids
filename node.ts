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
            return Matrix.ComposeToRef(this._transform.pos, rot, this._transform.scale, this._world);
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
                const gl = font.glyphs[ch];
                if (gl) {
                    for (let iSeg = 0; iSeg < gl.length; ++iSeg) {
                        const seg = gl[iSeg];
                        for (let iPt = 0; iPt < seg.length - 1; ++iPt) {
                            const pt0 = seg[iPt];
                            const pt1 = seg[iPt + 1];
                            p0.x = ofs.x + pt0.x;
                            p0.y = ofs.y + pt0.y;
                            p0.z = 0;
                            p1.x = ofs.x + pt1.x;
                            p1.y = ofs.y + pt1.y;
                            p1.z = 0;
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
}