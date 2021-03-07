namespace zoids {

    export class Game extends Scene {
        private orthoCam: Camera;
        private perspCam: Camera;
        private letters: TextNode;
        private box: ShapeNode;

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
            this.box.transform.pos.z = 4;
        }

        activate() {
        }

        update() {
            this.box.transform.rot.y += 0.037;
            this.box.transform.rot.z += 0.005;
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
