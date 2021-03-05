// Wait one interval to ensure all global initializers have executed.
setTimeout(() => zoids.scenes.startup(new zoids.Game()), 1);