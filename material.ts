namespace zoids {
    export enum ShadingMode {
        None,
        Solid,
        Dither
    }

    export class Material {

        /**
         * @colorGradient - lighting gradient. palette indices from lightest to darkest.
         */
        constructor(public colorGradient: number[], public shadingMode = ShadingMode.Solid) {
        }

        public static Default(): Material {
            return new Material([1]);
        }
    }
}
