import { describe, it, expect } from 'vitest';
import { validateBytes } from '../src/index';

describe('Hyper-Targeted Camera Coverage Tests', () => {

  it('should hit all uncovered camera validator TYPE_MISMATCH and validation paths', async () => {
    const gltf = {
      asset: { version: '2.0' },
      cameras: [
        {
          // Hit TYPE_MISMATCH for camera type (line 15-21)
          type: 123, // Number instead of string
          name: 'NumericTypeCamera'
        },
        {
          // Hit TYPE_MISMATCH for camera type with array
          type: ['perspective'], // Array instead of string  
          name: 'ArrayTypeCamera'
        },
        {
          // Hit TYPE_MISMATCH for camera type with object
          type: { value: 'perspective' }, // Object instead of string
          name: 'ObjectTypeCamera'
        },
        {
          // Hit VALUE_NOT_IN_LIST for invalid camera type (line 22-28)
          type: 'invalid_camera_type',
          name: 'InvalidTypeCamera'
        },
        {
          // Hit perspective TYPE_MISMATCH paths for yfov
          type: 'perspective',
          perspective: {
            yfov: 'not_a_number', // String instead of number
            znear: 0.1
          },
          name: 'PerspectiveYfovTypeCamera'
        },
        {
          // Hit perspective TYPE_MISMATCH paths for znear
          type: 'perspective', 
          perspective: {
            yfov: 1.0,
            znear: 'not_a_number' // String instead of number
          },
          name: 'PerspectiveZnearTypeCamera'
        },
        {
          // Hit perspective TYPE_MISMATCH paths for zfar
          type: 'perspective',
          perspective: {
            yfov: 1.0,
            znear: 0.1,
            zfar: 'not_a_number' // String instead of number
          },
          name: 'PerspectiveZfarTypeCamera'
        },
        {
          // Hit perspective TYPE_MISMATCH paths for aspectRatio
          type: 'perspective',
          perspective: {
            yfov: 1.0,
            znear: 0.1,
            aspectRatio: 'not_a_number' // String instead of number
          },
          name: 'PerspectiveAspectRatioTypeCamera'
        },
        {
          // Hit orthographic TYPE_MISMATCH paths for xmag
          type: 'orthographic',
          orthographic: {
            xmag: 'not_a_number', // String instead of number
            ymag: 1.0,
            zfar: 100.0,
            znear: 0.1
          },
          name: 'OrthographicXmagTypeCamera'
        },
        {
          // Hit orthographic TYPE_MISMATCH paths for ymag
          type: 'orthographic',
          orthographic: {
            xmag: 1.0,
            ymag: 'not_a_number', // String instead of number
            zfar: 100.0,
            znear: 0.1
          },
          name: 'OrthographicYmagTypeCamera'
        },
        {
          // Hit orthographic TYPE_MISMATCH paths for zfar
          type: 'orthographic',
          orthographic: {
            xmag: 1.0,
            ymag: 1.0,
            zfar: 'not_a_number', // String instead of number
            znear: 0.1
          },
          name: 'OrthographicZfarTypeCamera'
        },
        {
          // Hit orthographic TYPE_MISMATCH paths for znear
          type: 'orthographic',
          orthographic: {
            xmag: 1.0,
            ymag: 1.0,
            zfar: 100.0,
            znear: 'not_a_number' // String instead of number
          },
          name: 'OrthographicZnearTypeCamera'
        },
        {
          // Hit Infinity validation paths for perspective
          type: 'perspective',
          perspective: {
            yfov: Infinity, // Should hit VALUE_NOT_IN_RANGE for Infinity (line 82-88)
            znear: 0.1
          },
          name: 'PerspectiveInfinityYfov'
        },
        {
          // Hit -Infinity validation paths for perspective
          type: 'perspective',
          perspective: {
            yfov: -Infinity,
            znear: 0.1
          },
          name: 'PerspectiveNegInfinityYfov'
        },
        {
          // Hit NaN validation paths for perspective
          type: 'perspective',
          perspective: {
            yfov: NaN,
            znear: 0.1
          },
          name: 'PerspectiveNaNYfov'
        },
        {
          // Hit Infinity validation paths for perspective znear
          type: 'perspective',
          perspective: {
            yfov: 1.0,
            znear: Infinity // Should hit VALUE_NOT_IN_RANGE for Infinity (line 114-120)
          },
          name: 'PerspectiveInfinityZnear'
        },
        {
          // Hit Infinity validation paths for perspective zfar
          type: 'perspective',
          perspective: {
            yfov: 1.0,
            znear: 0.1,
            zfar: Infinity // Should hit VALUE_NOT_IN_RANGE for Infinity (line 132-138)
          },
          name: 'PerspectiveInfinityZfar'
        },
        {
          // Hit Infinity validation paths for perspective aspectRatio
          type: 'perspective',
          perspective: {
            yfov: 1.0,
            znear: 0.1,
            aspectRatio: Infinity // Should hit VALUE_NOT_IN_RANGE for Infinity (line 159-165)
          },
          name: 'PerspectiveInfinityAspectRatio'
        },
        {
          // Hit Infinity validation paths for orthographic xmag
          type: 'orthographic',
          orthographic: {
            xmag: Infinity, // Should hit VALUE_NOT_IN_RANGE for Infinity (line 209-215)
            ymag: 1.0,
            zfar: 100.0,
            znear: 0.1
          },
          name: 'OrthographicInfinityXmag'
        },
        {
          // Hit Infinity validation paths for orthographic ymag
          type: 'orthographic',
          orthographic: {
            xmag: 1.0,
            ymag: Infinity, // Should hit VALUE_NOT_IN_RANGE for Infinity (line 234-240)
            zfar: 100.0,
            znear: 0.1
          },
          name: 'OrthographicInfinityYmag'
        },
        {
          // Hit Infinity validation paths for orthographic zfar
          type: 'orthographic',
          orthographic: {
            xmag: 1.0,
            ymag: 1.0,
            zfar: Infinity, // Should hit VALUE_NOT_IN_RANGE for Infinity (line 259-265)
            znear: 0.1
          },
          name: 'OrthographicInfinityZfar'
        },
        {
          // Hit Infinity validation paths for orthographic znear
          type: 'orthographic',
          orthographic: {
            xmag: 1.0,
            ymag: 1.0,
            zfar: 100.0,
            znear: Infinity // Should hit VALUE_NOT_IN_RANGE for Infinity (line 284-290)
          },
          name: 'OrthographicInfinityZnear'
        },
        {
          // Hit CAMERA_YFOV_GEQUAL_PI validation (line 96-102)
          type: 'perspective',
          perspective: {
            yfov: Math.PI + 0.1, // Greater than PI
            znear: 0.1
          },
          name: 'PerspectiveYfovGreaterThanPi'
        },
        {
          // Hit exactly PI edge case
          type: 'perspective',
          perspective: {
            yfov: Math.PI, // Exactly PI
            znear: 0.1
          },
          name: 'PerspectiveYfovEqualsPi'
        },
        {
          // Hit UNEXPECTED_PROPERTY validation for camera level (line 53-62)
          type: 'perspective',
          perspective: {
            yfov: 1.0,
            znear: 0.1
          },
          unexpectedCameraProp: 'this should trigger warning',
          anotherUnexpected: 123,
          name: 'UnexpectedCameraProps'
        },
        {
          // Hit UNEXPECTED_PROPERTY validation for perspective object (line 177-187)
          type: 'perspective',
          perspective: {
            yfov: 1.0,
            znear: 0.1,
            unexpectedPerspectiveProp: 'this should trigger warning',
            anotherUnexpectedPerspective: 456
          },
          name: 'UnexpectedPerspectiveProps'
        },
        {
          // Hit UNEXPECTED_PROPERTY validation for orthographic object (line 316-326)
          type: 'orthographic',
          orthographic: {
            xmag: 1.0,
            ymag: 1.0,
            zfar: 100.0,
            znear: 0.1,
            unexpectedOrthographicProp: 'this should trigger warning',
            anotherUnexpectedOrthographic: 789
          },
          name: 'UnexpectedOrthographicProps'
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'hyper-targeted-camera.gltf' });
    
    // Should generate many errors and warnings for type mismatches and invalid values
    expect(result.issues.numErrors).toBeGreaterThan(0);
    expect(result.issues.numWarnings).toBeGreaterThan(0);
  });

});