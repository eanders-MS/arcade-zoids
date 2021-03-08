namespace zoids {

    const TURN_SPEED = 0.1;

    export class ShipNode extends Node {
        ship: PolygonNode;
        thrust: PolygonNode;

        constructor(private game: Game) {
            super(game);
            this.ship = new PolygonNode(polygons.Ship, 1, game);
            this.ship.parent = this;
            this.thrust = new PolygonNode(polygons.Thruster, 2, game);
            this.thrust.parent = this;
        }

        update() {
            if (controller.right.isPressed()) this.transform.rot.z += TURN_SPEED;
            if (controller.left.isPressed()) this.transform.rot.z -= TURN_SPEED;
            this.ship.update();
            this.thrust.update();
        }

        draw(camera: Camera) {
            this.ship.draw(camera);
            this.thrust.draw(camera);
        }
    }
}