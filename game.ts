namespace zoids {

    export class Game extends Scene {
        private orthoCam: Camera;
        private perspCam: Camera;
        private globe: ShapeNode;
        private ship: Ship;

        constructor() {
            super();
        }

        startup() {
            super.startup();
            this.orthoCam = new Camera(CameraType.Orthographic, Matrix.OrthoLH(scene.screenWidth(), scene.screenHeight(), 1, 100));
            this.perspCam = new Camera(CameraType.Perspective, Matrix.PerspectiveFovLH(1.2, scene.screenWidth() / scene.screenHeight(), 1, 100));
            this.globe = new ShapeNode(shapes.Sphere, 11, this, { drawCA: true });
            this.globe.transform.scale = Vector3.FromScalar(3);
            this.globe.transform.pos.z = 2.5;
            this.ship = new Ship(this);
        }

        activate() {
        }

        update() {
            this.ship.update();
            this.globe.transform.rot.y += this.ship.vel.x;
            this.globe.transform.rot.x += this.ship.vel.y;
        }

        draw() {
            scene.backgroundImage().fill(15);
            this.orthoCam.recalc();
            this.perspCam.recalc();
            this.globe.draw(this.perspCam);
            this.ship.draw(this.perspCam);
        }

    }
}
