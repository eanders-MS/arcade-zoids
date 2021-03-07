namespace zoids {

    export class Game extends Scene {
        private orthoCam: Camera;
        private perspCam: Camera;
        private letters: TextNode;
        private box: ShapeNode;
        private leftbox: ShapeNode;
        private rightbox: ShapeNode;

        constructor() {
            super();
        }

        startup() {
            super.startup();
            this.orthoCam = new Camera(CameraType.Orthographic, Matrix.OrthoLH(scene.screenWidth(), scene.screenHeight(), 1, 100));
            this.perspCam = new Camera(CameraType.Perspective, Matrix.PerspectiveFovLH(1.2, scene.screenWidth() / scene.screenHeight(), 1, 100));
            this.letters = new TextNode("ABCDEFGHIJKLMNOPQRSTUVWXYZ", 1, this);
            this.letters.transform.pos.z = 2;
            this.box = new ShapeNode(shapes.Box, 4, this);
            this.box.transform.pos.z = 5;
            this.leftbox = new ShapeNode(shapes.Box, 3, this);
            this.leftbox.transform.pos.x = -1.5;
            this.leftbox.transform.scale = Vector3.FromScalar(0.5);
            this.leftbox.parent = this.box;
            this.rightbox = new ShapeNode(shapes.Box, 5, this);
            this.rightbox.transform.pos.x = 1.5;
            this.rightbox.transform.scale = Vector3.FromScalar(0.5);
            this.rightbox.parent = this.box;
        }

        activate() {
        }

        update() {
            this.box.transform.rot.y += 0.037;
            this.box.transform.rot.z += 0.01;
            this.leftbox.transform.rot.x += 0.021;
            this.rightbox.transform.rot.y -= 0.015;
        }

        draw() {
            scene.backgroundImage().fill(15);
            this.orthoCam.recalc();
            this.perspCam.recalc();
            this.letters.draw(this.orthoCam);
            this.box.draw(this.perspCam);
        }

    }
}
