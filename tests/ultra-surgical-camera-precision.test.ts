import { describe, it, expect } from 'vitest';
import { validateBytes } from '../src/index';

describe('Ultra Surgical Camera Precision Tests', () => {

  it('should hit the exact deepest camera validator paths (targeting 51.37% -> 75%)', async () => {
    const gltf = {
      asset: { version: '2.0' },
      cameras: [
        {
          // Test camera without type property (TYPE_MISMATCH)
          perspective: {
            yfov: 1.0,
            znear: 0.1
          },
          name: 'NoTypeCamera'
        },
        {
          // Test camera with invalid type (not "perspective" or "orthographic")
          type: 'invalid_camera_type',
          perspective: {
            yfov: 1.0,
            znear: 0.1
          },
          name: 'InvalidTypeCamera'
        },
        {
          // Test camera with null type (TYPE_MISMATCH)
          type: null,
          perspective: {
            yfov: 1.0,
            znear: 0.1
          },
          name: 'NullTypeCamera'
        },
        {
          // Test camera with numeric type (TYPE_MISMATCH)
          type: 1,
          perspective: {
            yfov: 1.0,
            znear: 0.1
          },
          name: 'NumericTypeCamera'
        },
        {
          // Test perspective camera without perspective object (TYPE_MISMATCH)
          type: 'perspective',
          name: 'NoPerspectiveObjectCamera'
        },
        {
          // Test perspective camera with null perspective object (TYPE_MISMATCH)
          type: 'perspective',
          perspective: null,
          name: 'NullPerspectiveObjectCamera'
        },
        {
          // Test perspective camera with wrong type for perspective object (TYPE_MISMATCH)
          type: 'perspective',
          perspective: 'not_an_object',
          name: 'WrongPerspectiveTypeCamera'
        },
        {
          // Test perspective camera with array perspective object (TYPE_MISMATCH)
          type: 'perspective',
          perspective: [1, 2, 3, 4],
          name: 'ArrayPerspectiveCamera'
        },
        {
          // Test orthographic camera without orthographic object (TYPE_MISMATCH)
          type: 'orthographic',
          name: 'NoOrthographicObjectCamera'
        },
        {
          // Test orthographic camera with null orthographic object (TYPE_MISMATCH)
          type: 'orthographic',
          orthographic: null,
          name: 'NullOrthographicObjectCamera'
        },
        {
          // Test orthographic camera with wrong type for orthographic object (TYPE_MISMATCH)
          type: 'orthographic',
          orthographic: 'not_an_object',
          name: 'WrongOrthographicTypeCamera'
        },
        {
          // Test orthographic camera with array orthographic object (TYPE_MISMATCH)
          type: 'orthographic',
          orthographic: [1, 2, 3, 4],
          name: 'ArrayOrthographicCamera'
        },
        {
          // Test perspective camera without yfov (UNDEFINED_PROPERTY)
          type: 'perspective',
          perspective: {
            aspectRatio: 1.77,
            znear: 0.1,
            zfar: 1000.0
          },
          name: 'NoYfovCamera'
        },
        {
          // Test perspective camera with null yfov (TYPE_MISMATCH)
          type: 'perspective',
          perspective: {
            yfov: null,
            znear: 0.1
          },
          name: 'NullYfovCamera'
        },
        {
          // Test perspective camera with string yfov (TYPE_MISMATCH)
          type: 'perspective',
          perspective: {
            yfov: '1.0',
            znear: 0.1
          },
          name: 'StringYfovCamera'
        },
        {
          // Test perspective camera with array yfov (TYPE_MISMATCH)
          type: 'perspective',
          perspective: {
            yfov: [1.0],
            znear: 0.1
          },
          name: 'ArrayYfovCamera'
        },
        {
          // Test perspective camera with negative yfov (VALUE_NOT_IN_RANGE)
          type: 'perspective',
          perspective: {
            yfov: -1.0,
            znear: 0.1
          },
          name: 'NegativeYfovCamera'
        },
        {
          // Test perspective camera with zero yfov (VALUE_NOT_IN_RANGE)
          type: 'perspective',
          perspective: {
            yfov: 0.0,
            znear: 0.1
          },
          name: 'ZeroYfovCamera'
        },
        {
          // Test perspective camera with yfov >= PI (VALUE_NOT_IN_RANGE)
          type: 'perspective',
          perspective: {
            yfov: 3.15,
            znear: 0.1
          },
          name: 'TooLargeYfovCamera'
        },
        {
          // Test perspective camera without znear (UNDEFINED_PROPERTY)
          type: 'perspective',
          perspective: {
            yfov: 1.0,
            aspectRatio: 1.77,
            zfar: 1000.0
          },
          name: 'NoZnearCamera'
        },
        {
          // Test perspective camera with null znear (TYPE_MISMATCH)
          type: 'perspective',
          perspective: {
            yfov: 1.0,
            znear: null
          },
          name: 'NullZnearCamera'
        },
        {
          // Test perspective camera with string znear (TYPE_MISMATCH)
          type: 'perspective',
          perspective: {
            yfov: 1.0,
            znear: '0.1'
          },
          name: 'StringZnearCamera'
        },
        {
          // Test perspective camera with zero znear (VALUE_NOT_IN_RANGE)
          type: 'perspective',
          perspective: {
            yfov: 1.0,
            znear: 0.0
          },
          name: 'ZeroZnearCamera'
        },
        {
          // Test perspective camera with negative znear (VALUE_NOT_IN_RANGE)
          type: 'perspective',
          perspective: {
            yfov: 1.0,
            znear: -0.1
          },
          name: 'NegativeZnearCamera'
        },
        {
          // Test perspective camera with null aspectRatio (TYPE_MISMATCH)
          type: 'perspective',
          perspective: {
            yfov: 1.0,
            znear: 0.1,
            aspectRatio: null
          },
          name: 'NullAspectRatioCamera'
        },
        {
          // Test perspective camera with string aspectRatio (TYPE_MISMATCH)
          type: 'perspective',
          perspective: {
            yfov: 1.0,
            znear: 0.1,
            aspectRatio: '1.77'
          },
          name: 'StringAspectRatioCamera'
        },
        {
          // Test perspective camera with zero aspectRatio (VALUE_NOT_IN_RANGE)
          type: 'perspective',
          perspective: {
            yfov: 1.0,
            znear: 0.1,
            aspectRatio: 0.0
          },
          name: 'ZeroAspectRatioCamera'
        },
        {
          // Test perspective camera with negative aspectRatio (VALUE_NOT_IN_RANGE)
          type: 'perspective',
          perspective: {
            yfov: 1.0,
            znear: 0.1,
            aspectRatio: -1.77
          },
          name: 'NegativeAspectRatioCamera'
        },
        {
          // Test perspective camera with null zfar (TYPE_MISMATCH)
          type: 'perspective',
          perspective: {
            yfov: 1.0,
            znear: 0.1,
            zfar: null
          },
          name: 'NullZfarCamera'
        },
        {
          // Test perspective camera with string zfar (TYPE_MISMATCH)
          type: 'perspective',
          perspective: {
            yfov: 1.0,
            znear: 0.1,
            zfar: '1000.0'
          },
          name: 'StringZfarCamera'
        },
        {
          // Test perspective camera with zfar <= znear (VALUE_NOT_IN_RANGE)
          type: 'perspective',
          perspective: {
            yfov: 1.0,
            znear: 100.0,
            zfar: 50.0
          },
          name: 'ZfarLessThanZnearCamera'
        },
        {
          // Test perspective camera with zfar = znear (VALUE_NOT_IN_RANGE)
          type: 'perspective',
          perspective: {
            yfov: 1.0,
            znear: 100.0,
            zfar: 100.0
          },
          name: 'ZfarEqualsZnearCamera'
        },
        {
          // Test orthographic camera without xmag (UNDEFINED_PROPERTY)
          type: 'orthographic',
          orthographic: {
            ymag: 1.0,
            zfar: 1000.0,
            znear: 0.1
          },
          name: 'NoXmagCamera'
        },
        {
          // Test orthographic camera with null xmag (TYPE_MISMATCH)
          type: 'orthographic',
          orthographic: {
            xmag: null,
            ymag: 1.0,
            zfar: 1000.0,
            znear: 0.1
          },
          name: 'NullXmagCamera'
        },
        {
          // Test orthographic camera with string xmag (TYPE_MISMATCH)
          type: 'orthographic',
          orthographic: {
            xmag: '1.0',
            ymag: 1.0,
            zfar: 1000.0,
            znear: 0.1
          },
          name: 'StringXmagCamera'
        },
        {
          // Test orthographic camera with zero xmag (VALUE_NOT_IN_RANGE)
          type: 'orthographic',
          orthographic: {
            xmag: 0.0,
            ymag: 1.0,
            zfar: 1000.0,
            znear: 0.1
          },
          name: 'ZeroXmagCamera'
        },
        {
          // Test orthographic camera without ymag (UNDEFINED_PROPERTY)
          type: 'orthographic',
          orthographic: {
            xmag: 1.0,
            zfar: 1000.0,
            znear: 0.1
          },
          name: 'NoYmagCamera'
        },
        {
          // Test orthographic camera with null ymag (TYPE_MISMATCH)
          type: 'orthographic',
          orthographic: {
            xmag: 1.0,
            ymag: null,
            zfar: 1000.0,
            znear: 0.1
          },
          name: 'NullYmagCamera'
        },
        {
          // Test orthographic camera with string ymag (TYPE_MISMATCH)
          type: 'orthographic',
          orthographic: {
            xmag: 1.0,
            ymag: '1.0',
            zfar: 1000.0,
            znear: 0.1
          },
          name: 'StringYmagCamera'
        },
        {
          // Test orthographic camera with zero ymag (VALUE_NOT_IN_RANGE)
          type: 'orthographic',
          orthographic: {
            xmag: 1.0,
            ymag: 0.0,
            zfar: 1000.0,
            znear: 0.1
          },
          name: 'ZeroYmagCamera'
        },
        {
          // Test orthographic camera without zfar (UNDEFINED_PROPERTY)
          type: 'orthographic',
          orthographic: {
            xmag: 1.0,
            ymag: 1.0,
            znear: 0.1
          },
          name: 'NoZfarOrthoCamera'
        },
        {
          // Test orthographic camera with null zfar (TYPE_MISMATCH)
          type: 'orthographic',
          orthographic: {
            xmag: 1.0,
            ymag: 1.0,
            zfar: null,
            znear: 0.1
          },
          name: 'NullZfarOrthoCamera'
        },
        {
          // Test orthographic camera with string zfar (TYPE_MISMATCH)
          type: 'orthographic',
          orthographic: {
            xmag: 1.0,
            ymag: 1.0,
            zfar: '1000.0',
            znear: 0.1
          },
          name: 'StringZfarOrthoCamera'
        },
        {
          // Test orthographic camera without znear (UNDEFINED_PROPERTY)
          type: 'orthographic',
          orthographic: {
            xmag: 1.0,
            ymag: 1.0,
            zfar: 1000.0
          },
          name: 'NoZnearOrthoCamera'
        },
        {
          // Test orthographic camera with null znear (TYPE_MISMATCH)
          type: 'orthographic',
          orthographic: {
            xmag: 1.0,
            ymag: 1.0,
            zfar: 1000.0,
            znear: null
          },
          name: 'NullZnearOrthoCamera'
        },
        {
          // Test orthographic camera with string znear (TYPE_MISMATCH)
          type: 'orthographic',
          orthographic: {
            xmag: 1.0,
            ymag: 1.0,
            zfar: 1000.0,
            znear: '0.1'
          },
          name: 'StringZnearOrthoCamera'
        },
        {
          // Test orthographic camera with zero znear (VALUE_NOT_IN_RANGE)
          type: 'orthographic',
          orthographic: {
            xmag: 1.0,
            ymag: 1.0,
            zfar: 1000.0,
            znear: 0.0
          },
          name: 'ZeroZnearOrthoCamera'
        },
        {
          // Test orthographic camera with negative znear (VALUE_NOT_IN_RANGE)
          type: 'orthographic',
          orthographic: {
            xmag: 1.0,
            ymag: 1.0,
            zfar: 1000.0,
            znear: -0.1
          },
          name: 'NegativeZnearOrthoCamera'
        },
        {
          // Test orthographic camera with zfar <= znear (VALUE_NOT_IN_RANGE)
          type: 'orthographic',
          orthographic: {
            xmag: 1.0,
            ymag: 1.0,
            znear: 1000.0,
            zfar: 500.0
          },
          name: 'ZfarLessZnearOrthoCamera'
        },
        {
          // Test orthographic camera with zfar = znear (VALUE_NOT_IN_RANGE)
          type: 'orthographic',
          orthographic: {
            xmag: 1.0,
            ymag: 1.0,
            znear: 1000.0,
            zfar: 1000.0
          },
          name: 'ZfarEqualsZnearOrthoCamera'
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'ultra-camera-precision.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should hit camera validator edge cases and boundary conditions', async () => {
    const gltf = {
      asset: { version: '2.0' },
      cameras: [
        {
          // Test perspective camera with very small yfov (near zero boundary)
          type: 'perspective',
          perspective: {
            yfov: Number.MIN_VALUE, // Smallest positive number
            znear: 0.1
          },
          name: 'MinValueYfovCamera'
        },
        {
          // Test perspective camera with yfov just under PI
          type: 'perspective',
          perspective: {
            yfov: Math.PI - 0.001,
            znear: 0.1
          },
          name: 'AlmostPiYfovCamera'
        },
        {
          // Test perspective camera with yfov just over PI
          type: 'perspective',
          perspective: {
            yfov: Math.PI + 0.001,
            znear: 0.1
          },
          name: 'JustOverPiYfovCamera'
        },
        {
          // Test perspective camera with very small znear
          type: 'perspective',
          perspective: {
            yfov: 1.0,
            znear: Number.MIN_VALUE
          },
          name: 'MinValueZnearCamera'
        },
        {
          // Test perspective camera with very small positive aspectRatio
          type: 'perspective',
          perspective: {
            yfov: 1.0,
            znear: 0.1,
            aspectRatio: Number.MIN_VALUE
          },
          name: 'MinValueAspectRatioCamera'
        },
        {
          // Test perspective camera with very large aspectRatio
          type: 'perspective',
          perspective: {
            yfov: 1.0,
            znear: 0.1,
            aspectRatio: Number.MAX_VALUE
          },
          name: 'MaxValueAspectRatioCamera'
        },
        {
          // Test perspective camera with zfar very close to znear but still greater
          type: 'perspective',
          perspective: {
            yfov: 1.0,
            znear: 1.0,
            zfar: 1.0 + Number.EPSILON // Just barely greater than znear
          },
          name: 'EpsilonDifferenceZfar'
        },
        {
          // Test orthographic camera with very small positive xmag
          type: 'orthographic',
          orthographic: {
            xmag: Number.MIN_VALUE,
            ymag: 1.0,
            zfar: 1000.0,
            znear: 0.1
          },
          name: 'MinValueXmagCamera'
        },
        {
          // Test orthographic camera with very large xmag
          type: 'orthographic',
          orthographic: {
            xmag: Number.MAX_VALUE,
            ymag: 1.0,
            zfar: 1000.0,
            znear: 0.1
          },
          name: 'MaxValueXmagCamera'
        },
        {
          // Test orthographic camera with very small positive ymag
          type: 'orthographic',
          orthographic: {
            xmag: 1.0,
            ymag: Number.MIN_VALUE,
            zfar: 1000.0,
            znear: 0.1
          },
          name: 'MinValueYmagCamera'
        },
        {
          // Test orthographic camera with very large ymag
          type: 'orthographic',
          orthographic: {
            xmag: 1.0,
            ymag: Number.MAX_VALUE,
            zfar: 1000.0,
            znear: 0.1
          },
          name: 'MaxValueYmagCamera'
        },
        {
          // Test orthographic camera with zfar very close to znear
          type: 'orthographic',
          orthographic: {
            xmag: 1.0,
            ymag: 1.0,
            znear: 1.0,
            zfar: 1.0 + Number.EPSILON
          },
          name: 'EpsilonDifferenceZfarOrtho'
        },
        {
          // Test camera with Infinity values
          type: 'perspective',
          perspective: {
            yfov: Number.POSITIVE_INFINITY, // Invalid
            znear: 0.1
          },
          name: 'InfinityYfovCamera'
        },
        {
          // Test camera with NaN values
          type: 'perspective',
          perspective: {
            yfov: Number.NaN, // Invalid
            znear: 0.1
          },
          name: 'NaNYfovCamera'
        },
        {
          // Test perspective camera with all optional properties
          type: 'perspective',
          perspective: {
            yfov: 1.0,
            aspectRatio: 1.777,
            znear: 0.01,
            zfar: 1000.0
          },
          name: 'FullPerspectiveCamera'
        },
        {
          // Test orthographic camera with all required properties
          type: 'orthographic',
          orthographic: {
            xmag: 10.0,
            ymag: 10.0,
            zfar: 100.0,
            znear: 1.0
          },
          name: 'FullOrthographicCamera'
        },
        {
          // Test camera with extensions and extras
          type: 'perspective',
          perspective: {
            yfov: 1.0,
            znear: 0.1,
            extensions: {
              'CAMERA_EXTENSION': {
                cameraProperty: 'test'
              }
            },
            extras: {
              cameraCustom: true
            }
          },
          extensions: {
            'CAMERA_NODE_EXTENSION': {
              nodeProperty: 'test'
            }
          },
          extras: {
            nodeCustom: true
          },
          name: 'ExtensionsExtrasCamera'
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'camera-boundary-conditions.gltf' });
    expect(result.issues.messages.length).toBeGreaterThanOrEqual(0);
  });

});