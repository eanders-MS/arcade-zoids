namespace zoids {
    let IdSequence = 0;

    export enum NodeMode {
        Orthographic,
        Perspective
    }

    export class Node {
        private _id: number;
        private _transform: Transform;
        private _children: Node[];
        private _parent: Node;

        public get id() { return this._id; }
        public get transform() { return this._transform; }
        public get parent() { return this._parent; }
        public set parent(v: Node) {
            if (this._parent) {
                this._parent.removeChild(this);
            }
            if (v) {
                v.addChild(this);
            }
        }

        constructor(public scene: Scene, public mode: NodeMode) {
            this._id = ++IdSequence;
            this._children = [];
            this._transform = new Transform();
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

    export class TextNode extends Node {

        constructor(public text: string, public color: number, scene: Scene, mode: NodeMode) {
            super(scene, mode);
        }

        draw(camera: Camera) {
            if (this.mode === NodeMode.Orthographic && !this.parent) {
                let x = this.transform.pos.x;
                let y = this.transform.pos.y;
                const img = scene.backgroundImage();
                for (let iCh = 0; iCh < this.text.length; ++iCh) {
                    const ch = this.text.charAt(iCh);
                    const gl = font.glyphs[ch];
                    if (gl) {
                        for (let iSeg = 0; iSeg < gl.length; ++iSeg) {
                            const seg = gl[iSeg];
                            for (let iPt = 0; iPt < seg.length - 1; ++iPt) {
                                const p0 = seg[iPt];
                                const p1 = seg[iPt + 1];
                                img.drawLine(x + p0.x, y + p0.y, x + p1.x, y + p1.y, this.color);
                            }
                        }
                    }
                    x += font.width + 1;
                }
            }
        }
    }
}