namespace zoids {

    export class Game extends Scene {
        private orthoCam: Camera;
        private perspCam: Camera;
        private letters: TextNode;
        private numbers: TextNode;

        constructor() {
            super();
        }

        startup() {
            super.startup();
            this.orthoCam = new Camera(CameraType.Orthographic, Matrix.OrthoLH(scene.screenWidth(), scene.screenHeight(), 1, 100));
            this.perspCam = new Camera(CameraType.Perspective, Matrix.PerspectiveFovLH(1.57, scene.screenWidth() / scene.screenHeight(), 1, 100));
            this.letters = new TextNode("ABCDEFGHIJKLMNOPQRSTUVWXYZ", 1, this);
            this.letters.transform.pos.z = 2;
            this.numbers = new TextNode("012345", 3, this);
            this.numbers.horzJust = HorizontalJustification.Center;
            this.numbers.transform.pos.z = 2;
            //this.numbers.transform.pos.x = 80;
        }

        activate() {
        }

        update() {
            //this.perspCam.rot.z += 0.01;
            this.numbers.transform.rot.z += 0.01;
            //this.numbers.transform.rot.y += 0.03;
            //this.numbers.transform.rot.x += 0.007;
        }

        draw() {
            scene.backgroundImage().fill(15);
            this.orthoCam.recalc();
            this.perspCam.recalc();
            this.letters.draw(this.orthoCam);
            this.numbers.draw(this.perspCam);
        }

    }
}
