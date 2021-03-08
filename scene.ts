namespace zoids {
    export class Scene implements SpriteLike {

        constructor() {
        }

        /**
         * @internal
         * Called once, when the scene is pushed to the scene manager.
         * Intended to allocate scene resources (one-time init).
         * OVERLOAD MUST CALL BASE
         */
        startup() {
            game.currentScene().addSprite(this);
        }

        /**
         * @internal
         * Called once, when the scene is popped from the scene manager.
         * Intenged to free scene resources (one-time deinit)
         */
        shutdown() {
        }

        /**
         * @internal
         * Called each time the scene becomes the active scene.
         * Intended for "waking up" the scene, starting timers, etc.
         */
        activate() {
        }

        /**
         * @internal
         * Called each time the scene goes inactive (like when another scene is pushed).
         * Intended for "going to sleep", stopping timers, etc.
         */
        deactivate() {
        }

        /**
         * @internal
         * Called on the active scene by the scene manager each game update.
         */
        update() {
        }

        /**
         * @internal
         * Called on the active scene by the scene manager each game draw.
         */
        draw() {
        }

        // SpriteLike impl, so the scene can get a draw call from the Arcade scene.
        z: number;
        id: number;
        flags?: number;
        __serialize(offset: number): Buffer { return null; }
        __update(camera: scene.Camera, dt: number): void {
            this.update();
        }
        __draw(camera: scene.Camera): void {
            this.draw();
        }
    }

    export class scenes {
        public static stack: Scene[] = [];

        private static currScene(): Scene {
            if (this.stack.length) {
                return this.stack[this.stack.length - 1];
            }
            return undefined;
        }

        public static pushScene(scene: Scene) {
            const curr = this.currScene();
            if (curr) {
                curr.deactivate();
            }
            game.pushScene();
            this.stack.push(scene);
            scene.startup();
            scene.activate();
        }

        public static popScene() {
            const prev = this.stack.pop();
            if (prev) {
                prev.deactivate();
                prev.shutdown();
            }
            game.popScene();
            const curr = this.currScene();
            if (curr) {
                curr.activate();
            }
        }

        public static replaceScene(scene: Scene) {
            this.popScene();
            this.pushScene(scene);
        }
    }

    export function startup(scene: Scene) {
        // Clear out all the scenes
        while (scenes.stack.length) {
            scenes.popScene();
        }
        for (let i = 0; i < 10; ++i) {
            game.popScene();
        }
        scenes.pushScene(scene);
    }

    game.addScenePopHandler((oldScene: scene.Scene) => oldScene.destroy());
}
