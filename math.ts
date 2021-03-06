namespace zoids {
    export class Vector3 {
        constructor(public x = 0, public y = 0, public z = 0) {
        }

        public static Zero(): Vector3 {
            return new Vector3(0, 0, 0);
        }

        public static One(): Vector3 {
            return new Vector3(1, 1, 1);
        }

        public copyFrom(v: Vector3): this {
            this.x = v.x;
            this.y = v.y;
            this.z = v.z;
            return this;
        }

        public normalize(): this {
            let mag = this.magnitudeSq();
            if (mag != 1.0 && mag != 0.0) {
                mag = Math.sqrt(mag);
                this.scale(1.0 / mag);
            }
            return this;
        }

        public scale(mag: number): this {
            this.x *= mag;
            this.y *= mag;
            this.z *= mag;
            return this;
        }

        public magnitude(): number {
            return Math.sqrt(this.magnitude());
        }

        public magnitudeSq(): number {
            return this.x * this.x + this.y * this.y + this.z * this.z;
        }

        public subtractToRef(pt: Vector3, res: Vector3): Vector3 {
            res.x = this.x - pt.x;
            res.y = this.y - pt.y;
            res.z = this.z - pt.z;
            return res;
        }

        public addToRef(pt: Vector3, res: Vector3): Vector3 {
            res.x = this.x + pt.x;
            res.y = this.y + pt.y;
            res.z = this.z + pt.z;
            return res;
        }

        public crossToRef(right: Vector3, res: Vector3): Vector3 {
            res.x = this.y * right.z - this.z * right.y;
            res.y = this.z * right.x - this.x * right.z;
            res.z = this.x * right.y - this.y * right.x;
            return res;            
        }

        public dot(right: Vector3): number {
            return (this.x * right.x + this.y * right.y + this.z * right.z);
        }

        public rotateByQuaternionAroundPointToRef(quat: Quaternion, pt: Vector3, res: Vector3): Vector3 {
            this.subtractToRef(pt, MathTmp.v3);
            MathTmp.v3.rotateByQuaternionToRef(quat, MathTmp.v3);
            this.addToRef(MathTmp.v3, res);
            return res;
        }

        public rotateByQuaternionToRef(quat: Quaternion, res: Vector3): Vector3 {
            Matrix.FromQuaternionToRef(quat, MathTmp.mat);
            this.transformToRef(MathTmp.mat, res);
            return res;
        }

        public transform(mat: Matrix): Vector3 {
            return Vector3.TransformToRef(this, mat, this);
        }

        public transformToRef(mat: Matrix, res: Vector3): Vector3 {
            return Vector3.TransformToRef(this, mat, res);
        }

        public static Add(p0: Vector3, p1: Vector3): Vector3 {
            return Vector3.AddToRef(p0, p1, new Vector3());
        }

        public static AddToRef(p0: Vector3, p1: Vector3, res: Vector3): Vector3 {
            res.x = p0.x + p1.x;
            res.y = p0.y + p1.y;
            res.z = p0.z + p1.z;
            return res;
        }

        public static TransformToRef(v: Vector3, mat: Matrix, res: Vector3): Vector3 {
            const m = mat.m;
            const rx = v.x * m[0] + v.y * m[4] + v.z * m[8] + m[12];
            const ry = v.x * m[1] + v.y * m[5] + v.z * m[9] + m[13];
            const rz = v.x * m[2] + v.y * m[6] + v.z * m[10] + m[14];
            const rw = 1 / (v.x * m[3] + v.y * m[7] + v.z * m[11] + m[15]);

            res.x = rx * rw;
            res.y = ry * rw;
            res.z = rz * rw;

            return res;
        }
    }

    export class Quaternion {
        constructor(public x = 0, public y = 0, public z = 0, public w = 1) {
        }

        public copyFrom(v: Quaternion): this {
            this.x = v.x;
            this.y = v.y;
            this.z = v.z;
            this.w = v.w;
            return this;
        }

        public static Identity(): Quaternion {
            return new Quaternion(0, 0, 0, 1);
        }

        public static FromAxisAngleToRef(axis: Vector3, angle: number, ref: Quaternion): Quaternion {
            const ao2 = angle / 2;
            const sin = Math.sin(ao2);
            axis.normalize();
            ref.w = Math.cos(ao2);
            ref.x = axis.x * sin;
            ref.y = axis.y * sin;
            ref.z = axis.z * sin;
            return ref;
        }
    }

    export class Matrix {
        public m: number[];

        constructor() {
            this.m = [
                1.0, 0.0, 0.0, 0.0,
                0.0, 1.0, 0.0, 0.0,
                0.0, 0.0, 1.0, 0.0,
                0.0, 0.0, 0.0, 1.0,
            ];
        }

        public static Identity(): Matrix {
            return new Matrix();
        }

        public static FromValuesToRef(
            m11: number, m12: number, m13: number, m14: number, // 1st row
            m21: number, m22: number, m23: number, m24: number, // 2nd row
            m31: number, m32: number, m33: number, m34: number, // 3rd row
            m41: number, m42: number, m43: number, m44: number, // 4th row
            res: Matrix
        ): Matrix {
            const m = res.m;
            m[0] = m11; m[1] = m12; m[2] = m13; m[3] = m14;
            m[4] = m21; m[5] = m22; m[6] = m23; m[7] = m24;
            m[8] = m31; m[9] = m32; m[10] = m33; m[11] = m34;
            m[12] = m41; m[13] = m42; m[14] = m43; m[15] = m44;
            return res;
        }

        public static FromQuaternionToRef(quat: Quaternion, res: Matrix): Matrix {
            const xx = quat.x * quat.x;
            const yy = quat.y * quat.y;
            const zz = quat.z * quat.z;
            const xy = quat.x * quat.y;
            const zw = quat.z * quat.w;
            const zx = quat.z * quat.x;
            const yw = quat.y * quat.w;
            const yz = quat.y * quat.z;
            const xw = quat.x * quat.w;

            res.m[0] = 1.0 - (2.0 * (yy + zz));
            res.m[1] = 2.0 * (xy + zw);
            res.m[2] = 2.0 * (zx - yw);
            res.m[3] = 0.0;

            res.m[4] = 2.0 * (xy - zw);
            res.m[5] = 1.0 - (2.0 * (zz + xx));
            res.m[6] = 2.0 * (yz + xw);
            res.m[7] = 0.0;

            res.m[8] = 2.0 * (zx + yw);
            res.m[9] = 2.0 * (yz - xw);
            res.m[10] = 1.0 - (2.0 * (yy + xx));
            res.m[11] = 0.0;

            res.m[12] = 0.0;
            res.m[13] = 0.0;
            res.m[14] = 0.0;
            res.m[15] = 1.0;

            return res;
        }

        public static PerspectiveFovLH(fov: number, aspect: number, znear: number, zfar: number): Matrix {
            return Matrix.PerspectiveFovLHToRef(fov, aspect, znear, zfar, new Matrix());
        }

        public static PerspectiveFovLHToRef(fov: number, aspect: number, znear: number, zfar: number, res: Matrix, isVerticalFovFixed = true): Matrix {
            const n = znear;
            const f = zfar;

            const t = 1.0 / (Math.tan(fov * 0.5));
            const a = isVerticalFovFixed ? (t / aspect) : t;
            const b = isVerticalFovFixed ? t : (t * aspect);
            const c = f !== 0 ? (f + n) / (f - n) : 1;
            const d = f !== 0 ? -2.0 * f * n / (f - n) : -2 * n;

            return Matrix.FromValuesToRef(
                a, 0.0, 0.0, 0.0,
                0.0, b, 0.0, 0.0,
                0.0, 0.0, c, 1.0,
                0.0, 0.0, d, 0.0,
                res
            );
        }

        public static OrthoLH(width: number, height: number, znear: number, zfar: number): Matrix {
            return Matrix.OrthoLHToRef(width, height, znear, zfar, new Matrix());
        }

        public static OrthoLHToRef(width: number, height: number, znear: number, zfar: number, res: Matrix): Matrix {
            const n = znear;
            const f = zfar;

            const a = 2.0 / width;
            const b = 2.0 / height;
            const c = 2.0 / (f - n);
            const d = -(f + n) / (f - n);

            return Matrix.FromValuesToRef(
                a, 0.0, 0.0, 0.0,
                0.0, b, 0.0, 0.0,
                0.0, 0.0, c, 0.0,
                0.0, 0.0, d, 1.0,
                res
            );
        }

        public static Compose(trans: Transform): Matrix {
            return Matrix.ComposeToRef(trans, new Matrix());
        }

        public static ComposeToRef(trans: Transform, res: Matrix): Matrix {
            const m = res.m;
            const x = trans.rot.x, y = trans.rot.y, z = trans.rot.z, w = trans.rot.w;
            const x2 = x + x, y2 = y + y, z2 = z + z;
            const xx = x * x2, xy = x * y2, xz = x * z2;
            const yy = y * y2, yz = y * z2, zz = z * z2;
            const wx = w * x2, wy = w * y2, wz = w * z2;
            const sx = trans.scale.x, sy = trans.scale.y, sz = trans.scale.z;

            m[0] = (1 - (yy + zz)) * sx;
            m[1] = (xy + wz) * sx;
            m[2] = (xz - wy) * sx;
            m[3] = 0;

            m[4] = (xy - wz) * sy;
            m[5] = (1 - (xx + zz)) * sy;
            m[6] = (yz + wx) * sy;
            m[7] = 0;

            m[8] = (xz + wy) * sz;
            m[9] = (yz - wx) * sz;
            m[10] = (1 - (xx + yy)) * sz;
            m[11] = 0;

            m[12] = trans.pos.x;
            m[13] = trans.pos.y;
            m[14] = trans.pos.z;
            m[15] = 1;

            return res;
        }

        public static Multiply(A: Matrix, B: Matrix): Matrix {
            return Matrix.MultiplyToRef(A, B, new Matrix());
        }

        public static MultiplyToRef(A: Matrix, B: Matrix, C: Matrix): Matrix {
            const a = A.m;
            const b = B.m;
            const c = C.m;
            const am0 = a[0], am1 = a[1], am2 = a[2], am3 = a[3];
            const am4 = a[4], am5 = a[5], am6 = a[6], am7 = a[7];
            const am8 = a[8], am9 = a[9], am10 = a[10], am11 = a[11];
            const am12 = a[12], am13 = a[13], am14 = a[14], am15 = a[15];

            const bm0 = b[0], bm1 = b[1], bm2 = b[2], bm3 = b[3];
            const bm4 = b[4], bm5 = b[5], bm6 = b[6], bm7 = b[7];
            const bm8 = b[8], bm9 = b[9], bm10 = b[10], bm11 = b[11];
            const bm12 = b[12], bm13 = b[13], bm14 = b[14], bm15 = b[15];

            c[0] = am0 * bm0 + am1 * bm4 + am2 * bm8 + am3 * bm12;
            c[1] = am0 * bm1 + am1 * bm5 + am2 * bm9 + am3 * bm13;
            c[2] = am0 * bm2 + am1 * bm6 + am2 * bm10 + am3 * bm14;
            c[3] = am0 * bm3 + am1 * bm7 + am2 * bm11 + am3 * bm15;

            c[4] = am4 * bm0 + am5 * bm4 + am6 * bm8 + am7 * bm12;
            c[5] = am4 * bm1 + am5 * bm5 + am6 * bm9 + am7 * bm13;
            c[6] = am4 * bm2 + am5 * bm6 + am6 * bm10 + am7 * bm14;
            c[7] = am4 * bm3 + am5 * bm7 + am6 * bm11 + am7 * bm15;

            c[8] = am8 * bm0 + am9 * bm4 + am10 * bm8 + am11 * bm12;
            c[9] = am8 * bm1 + am9 * bm5 + am10 * bm9 + am11 * bm13;
            c[10] = am8 * bm2 + am9 * bm6 + am10 * bm10 + am11 * bm14;
            c[11] = am8 * bm3 + am9 * bm7 + am10 * bm11 + am11 * bm15;

            c[12] = am12 * bm0 + am13 * bm4 + am14 * bm8 + am15 * bm12;
            c[13] = am12 * bm1 + am13 * bm5 + am14 * bm9 + am15 * bm13;
            c[14] = am12 * bm2 + am13 * bm6 + am14 * bm10 + am15 * bm14;
            c[15] = am12 * bm3 + am13 * bm7 + am14 * bm11 + am15 * bm15;

            return C;
        }
    }

    export class Viewport {
        constructor(public x: number, public y: number, public width: number, public height: number) {
        }
    }

    class MathTmp {
        public static v3 = new Vector3();
        public static mat = new Matrix();
    }
}