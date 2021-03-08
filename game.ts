namespace zoids {

    export class Game extends Scene {
        private orthoCam: Camera;
        private perspCam: Camera;
        private ico: ShapeNode;
        private ship: Ship;

        constructor() {
            super();
        }

        startup() {
            super.startup();
            this.orthoCam = new Camera(CameraType.Orthographic, Matrix.OrthoLH(scene.screenWidth(), scene.screenHeight(), 1, 100));
            this.perspCam = new Camera(CameraType.Perspective, Matrix.PerspectiveFovLH(1.2, scene.screenWidth() / scene.screenHeight(), 1, 100));
            this.ico = new ShapeNode(shapes.IcoSphere, 11, this, { drawCA: true });
            this.ico.transform.pos.z = 0.8;
            this.ship = new Ship(this);
        }

        activate() {
        }

        update() {
            this.ship.update();
            this.ico.transform.rot.y += this.ship.vel.x;
        }

        draw() {
            scene.backgroundImage().fill(15);
            this.orthoCam.recalc();
            this.perspCam.recalc();
            this.ico.draw(this.perspCam);
            this.ship.draw(this.perspCam);
        }

    }
}
