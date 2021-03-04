namespace zoids {
    export class Material {
        /**
         * @colorGradient - lighting gradient. palette indices from lightest to darkest.
         */
        constructor(public colorGradient: number[]) {
        }

        public static Default(): Material {
            return new Material([1]);
        }
    }
}
