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
            this.orthoCam = new Camera(CameraType.Orthographic, Matrix.OrthoLH(scene.screenWidth(), scene.screenHeight(), 0, 100));
            this.perspCam = new Camera(CameraType.Perspective, Matrix.PerspectiveFovLH(0.8, scene.screenWidth() / scene.screenHeight(), 0, 100));
            this.letters = new TextNode("ABCDEFGHIJKLMNOPQRSTUVWXYZ", 1, this);
            this.numbers = new TextNode("0123456789", 3, this);
            this.numbers.transform.pos.y = font.height + 1;
        }

        activate() {
        }

        draw() {
            scene.backgroundImage().fill(15);
            this.letters.draw(this.orthoCam);
            this.numbers.draw(this.perspCam);
        }

    }
}
