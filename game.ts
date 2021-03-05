namespace zoids {

    export class Game extends Scene {
        private orthCam: Camera;
        private letters: TextNode;
        private numbers: TextNode;

        constructor() {
            super();
        }

        startup() {
            super.startup();
            this.orthCam = new Camera(Matrix.OrthoLH(scene.screenWidth(), scene.screenHeight(), 0, 100));
            this.letters = new TextNode("ABCDEFGHIJKLMNOPQRSTUVWXYZ", 1, this, NodeMode.Orthographic);
            this.numbers = new TextNode("0123456789", 1, this, NodeMode.Orthographic);
            this.numbers.transform.pos.y = font.height + 1;
        }

        activate() {
        }

        draw() {
            scene.backgroundImage().fill(15);
            this.letters.draw(this.orthCam);
            this.numbers.draw(this.orthCam);
            //scene.backgroundImage().drawLine(randint(0, 159), randint(0, 119), randint(0, 159), randint(0, 119), randint(1, 15))
        }

    }
}
