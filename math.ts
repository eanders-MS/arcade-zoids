namespace zoids {
    export class Vector3 {
        constructor(public x = 0, public y = 0, public z = 0) {
        }

        public static Zero(): Vector3 {
            return new Vector3(0, 0, 0);
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

        public transformToRef(mat: Matrix, res: Vector3): Vector3 {
            const m = mat.m;
            const rx = this.x * m[0] + this.y * m[4] + this.z * m[8] + m[12];
            const ry = this.x * m[1] + this.y * m[5] + this.z * m[9] + m[13];
            const rz = this.x * m[2] + this.y * m[6] + this.z * m[10] + m[14];
            const rw = 1 / (this.x * m[3] + this.y * m[7] + this.z * m[11] + m[15]);

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

        public static ComposeToRef(trans: Vector3, rot: Quaternion, scale: Vector3, res: Matrix): Matrix {
            const m = res.m;
            const x = rot.x, y = rot.y, z = rot.z, w = rot.w;
            const x2 = x + x, y2 = y + y, z2 = z + z;
            const xx = x * x2, xy = x * y2, xz = x * z2;
            const yy = y * y2, yz = y * z2, zz = z * z2;
            const wx = w * x2, wy = w * y2, wz = w * z2;
            const sx = scale.x, sy = scale.y, sz = scale.z;

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

            m[12] = trans.x;
            m[13] = trans.y;
            m[14] = trans.z;
            m[15] = 1;

            return res;
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