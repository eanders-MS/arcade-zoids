namespace zoids {

    export class Ship {
        node: PolygonNode;

        public vel: Vector3;

        constructor(private scene: Scene) {
            this.vel = Vector3.Zero();
            this.node = new PolygonNode(polygons.Ship, 1, scene);
            this.node.transform.pos.z = 1;
            this.node.transform.scale = Vector3.FromScalar(0.1);
        }

        update() {
            const speed = 0.001;
            let ax = 0;
            let ay = 0;
            if (controller.up.isPressed()) ay -= speed;
            if (controller.down.isPressed()) ay += speed;
            if (controller.left.isPressed()) ax -= speed;
            if (controller.right.isPressed()) ax += speed;
            this.vel.x += ax;
            this.vel.y += ay;
            if (!ax && !ay) {
                // friction
                this.vel.x *= 0.9;
                this.vel.y *= 0.9;
            }
        }

        draw(camera: Camera) {
            this.node.draw(camera);
        }
    }
}