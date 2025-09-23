import { GLTFCamera, ValidationMessage, Severity, CameraType } from '../types';

export class CameraValidator {
  validate(camera: GLTFCamera, index: number): ValidationMessage[] {
    const messages: ValidationMessage[] = [];

    // Check required type
    if (!camera.type) {
      messages.push({
        code: 'UNDEFINED_PROPERTY',
        message: 'Property \'type\' must be defined.',
        severity: Severity.ERROR,
        pointer: `/cameras/${index}`
      });
    } else if (typeof camera.type !== 'string') {
      messages.push({
        code: 'TYPE_MISMATCH',
        message: 'Camera type must be a string.',
        severity: Severity.ERROR,
        pointer: `/cameras/${index}/type`
      });
    } else if (!Object.values(CameraType).includes(camera.type as any)) {
      messages.push({
        code: 'VALUE_NOT_IN_LIST',
        message: 'Invalid value \'' + camera.type + '\'. Valid values are (\'orthographic\', \'perspective\').',
        severity: Severity.WARNING,
        pointer: `/cameras/${index}/type`
      });
    }

    // Check for exactly one of orthographic/perspective constraint
    const hasOrthographic = camera.orthographic !== undefined;
    const hasPerspective = camera.perspective !== undefined;
    
    if (hasOrthographic && hasPerspective) {
      messages.push({
        code: 'ONE_OF_MISMATCH',
        message: "Exactly one of ('orthographic', 'perspective') properties must be defined.",
        severity: Severity.ERROR,
        pointer: `/cameras/${index}`
      });
    }

    // Check for unexpected properties on main camera first (before nested objects)
    const expectedProperties = ['orthographic', 'perspective', 'type', 'name', 'extensions', 'extras'];
    for (const key in camera) {
      if (!expectedProperties.includes(key)) {
        messages.push({
          code: 'UNEXPECTED_PROPERTY',
          message: 'Unexpected property.',
          severity: Severity.WARNING,
          pointer: `/cameras/${index}/${key}`
        });
      }
    }

    // Check perspective camera properties
    if (camera.type === 'perspective' || camera.perspective) {
      if (!camera.perspective) {
        messages.push({
          code: 'UNDEFINED_PROPERTY',
          message: 'Property \'perspective\' must be defined.',
          severity: Severity.ERROR,
          pointer: `/cameras/${index}`
        });
      } else {
        // Check required yfov
        if (camera.perspective.yfov === undefined) {
          messages.push({
            code: 'UNDEFINED_PROPERTY',
            message: 'Property \'yfov\' must be defined.',
            severity: Severity.ERROR,
            pointer: `/cameras/${index}/perspective`
          });
        } else if (camera.perspective.yfov === null) {
          messages.push({
            code: 'VALUE_NOT_IN_RANGE',
            message: 'Value null is out of range.',
            severity: Severity.ERROR,
            pointer: `/cameras/${index}/perspective/yfov`
          });
        } else if (typeof camera.perspective.yfov === 'number') {
          if (!isFinite(camera.perspective.yfov) || isNaN(camera.perspective.yfov)) {
            const valueStr = isNaN(camera.perspective.yfov) ? 'NaN' : 
                           camera.perspective.yfov === Infinity ? 'Infinity' : 
                           camera.perspective.yfov === -Infinity ? '-Infinity' : 
                           camera.perspective.yfov.toString();
            messages.push({
              code: 'VALUE_NOT_IN_RANGE',
              message: `Value ${valueStr} is out of range.`,
              severity: Severity.ERROR,
              pointer: `/cameras/${index}/perspective/yfov`
            });
          } else if (camera.perspective.yfov <= 0) {
            messages.push({
              code: 'VALUE_NOT_IN_RANGE',
              message: `Value ${camera.perspective.yfov} is out of range.`,
              severity: Severity.ERROR,
              pointer: `/cameras/${index}/perspective/yfov`
            });
          } else if (camera.perspective.yfov >= Math.PI) {
            messages.push({
              code: 'CAMERA_YFOV_GEQUAL_PI',
              message: 'yfov should be less than Pi.',
              severity: Severity.WARNING,
              pointer: `/cameras/${index}/perspective`
            });
          }
        }
        
        // Check required znear
        if (camera.perspective.znear === undefined) {
          messages.push({
            code: 'UNDEFINED_PROPERTY',
            message: 'Property \'znear\' must be defined.',
            severity: Severity.ERROR,
            pointer: `/cameras/${index}/perspective`
          });
        } else if (camera.perspective.znear === null) {
          messages.push({
            code: 'VALUE_NOT_IN_RANGE',
            message: 'Value null is out of range.',
            severity: Severity.ERROR,
            pointer: `/cameras/${index}/perspective/znear`
          });
        } else if (typeof camera.perspective.znear === 'number') {
          if (!isFinite(camera.perspective.znear) || isNaN(camera.perspective.znear)) {
            const valueStr = isNaN(camera.perspective.znear) ? 'NaN' : 
                           camera.perspective.znear === Infinity ? 'Infinity' : 
                           camera.perspective.znear === -Infinity ? '-Infinity' : 
                           camera.perspective.znear.toString();
            messages.push({
              code: 'VALUE_NOT_IN_RANGE',
              message: `Value ${valueStr} is out of range.`,
              severity: Severity.ERROR,
              pointer: `/cameras/${index}/perspective/znear`
            });
          } else if (camera.perspective.znear <= 0) {
            messages.push({
              code: 'VALUE_NOT_IN_RANGE',
              message: `Value ${camera.perspective.znear} is out of range.`,
              severity: Severity.ERROR,
              pointer: `/cameras/${index}/perspective/znear`
            });
          }
        }
        
        // Check zfar > znear for perspective cameras
        if (camera.perspective.zfar !== undefined &&
            camera.perspective.znear !== undefined &&
            typeof camera.perspective.zfar === 'number' &&
            typeof camera.perspective.znear === 'number' &&
            camera.perspective.zfar <= camera.perspective.znear) {
          messages.push({
            code: 'CAMERA_ZFAR_LEQUAL_ZNEAR',
            message: 'zfar must be greater than znear.',
            severity: Severity.ERROR,
            pointer: `/cameras/${index}/perspective`
          });
        }
        
        // Check aspectRatio if present
        if (camera.perspective.aspectRatio !== undefined) {
          if (typeof camera.perspective.aspectRatio === 'number') {
            if (!isFinite(camera.perspective.aspectRatio) || isNaN(camera.perspective.aspectRatio)) {
              const valueStr = isNaN(camera.perspective.aspectRatio) ? 'NaN' : 
                             camera.perspective.aspectRatio === Infinity ? 'Infinity' : 
                             camera.perspective.aspectRatio === -Infinity ? '-Infinity' : 
                             camera.perspective.aspectRatio.toString();
              messages.push({
                code: 'VALUE_NOT_IN_RANGE',
                message: `Value ${valueStr} is out of range.`,
                severity: Severity.ERROR,
                pointer: `/cameras/${index}/perspective/aspectRatio`
              });
            } else if (camera.perspective.aspectRatio <= 0) {
              messages.push({
                code: 'VALUE_NOT_IN_RANGE',
                message: `Value ${camera.perspective.aspectRatio} is out of range.`,
                severity: Severity.ERROR,
                pointer: `/cameras/${index}/perspective/aspectRatio`
              });
            }
          }
        }
        
        // Check for unexpected properties in perspective
        const expectedPerspectiveProperties = ['yfov', 'zfar', 'znear', 'aspectRatio', 'extensions', 'extras'];
        for (const key in camera.perspective) {
          if (!expectedPerspectiveProperties.includes(key)) {
            messages.push({
              code: 'UNEXPECTED_PROPERTY',
              message: 'Unexpected property.',
              severity: Severity.WARNING,
              pointer: `/cameras/${index}/perspective/${key}`
            });
          }
        }
      }
    }

    // Check orthographic camera properties
    if (camera.type === 'orthographic' || camera.orthographic) {
      if (!camera.orthographic) {
        messages.push({
          code: 'UNDEFINED_PROPERTY',
          message: 'Property \'orthographic\' must be defined.',
          severity: Severity.ERROR,
          pointer: `/cameras/${index}`
        });
      } else {
        // Check required properties
        if (camera.orthographic.xmag === undefined) {
          messages.push({
            code: 'UNDEFINED_PROPERTY',
            message: 'Property \'xmag\' must be defined.',
            severity: Severity.ERROR,
            pointer: `/cameras/${index}/orthographic`
          });
        } else if (typeof camera.orthographic.xmag === 'number') {
          if (!isFinite(camera.orthographic.xmag) || isNaN(camera.orthographic.xmag)) {
            const valueStr = isNaN(camera.orthographic.xmag) ? 'NaN' : 
                           camera.orthographic.xmag === Infinity ? 'Infinity' : 
                           camera.orthographic.xmag === -Infinity ? '-Infinity' : 
                           camera.orthographic.xmag.toString();
            messages.push({
              code: 'VALUE_NOT_IN_RANGE',
              message: `Value ${valueStr} is out of range.`,
              severity: Severity.ERROR,
              pointer: `/cameras/${index}/orthographic/xmag`
            });
          } else if (camera.orthographic.xmag === 0) {
            messages.push({
              code: 'CAMERA_XMAG_YMAG_ZERO',
              message: 'xmag and ymag must not be zero.',
              severity: Severity.ERROR,
              pointer: `/cameras/${index}/orthographic/xmag`
            });
          } else if (camera.orthographic.xmag < 0) {
            messages.push({
              code: 'CAMERA_XMAG_YMAG_NEGATIVE',
              message: 'xmag and ymag should not be negative.',
              severity: Severity.WARNING,
              pointer: `/cameras/${index}/orthographic/xmag`
            });
          }
        }

        if (camera.orthographic.ymag === undefined) {
          messages.push({
            code: 'UNDEFINED_PROPERTY',
            message: 'Property \'ymag\' must be defined.',
            severity: Severity.ERROR,
            pointer: `/cameras/${index}/orthographic`
          });
        } else if (typeof camera.orthographic.ymag === 'number') {
          if (!isFinite(camera.orthographic.ymag) || isNaN(camera.orthographic.ymag)) {
            const valueStr = isNaN(camera.orthographic.ymag) ? 'NaN' : 
                           camera.orthographic.ymag === Infinity ? 'Infinity' : 
                           camera.orthographic.ymag === -Infinity ? '-Infinity' : 
                           camera.orthographic.ymag.toString();
            messages.push({
              code: 'VALUE_NOT_IN_RANGE',
              message: `Value ${valueStr} is out of range.`,
              severity: Severity.ERROR,
              pointer: `/cameras/${index}/orthographic/ymag`
            });
          } else if (camera.orthographic.ymag === 0) {
            messages.push({
              code: 'CAMERA_XMAG_YMAG_ZERO',
              message: 'xmag and ymag must not be zero.',
              severity: Severity.ERROR,
              pointer: `/cameras/${index}/orthographic/ymag`
            });
          } else if (camera.orthographic.ymag < 0) {
            messages.push({
              code: 'CAMERA_XMAG_YMAG_NEGATIVE',
              message: 'xmag and ymag should not be negative.',
              severity: Severity.WARNING,
              pointer: `/cameras/${index}/orthographic/ymag`
            });
          }
        }

        if (camera.orthographic.zfar === undefined) {
          messages.push({
            code: 'UNDEFINED_PROPERTY',
            message: 'Property \'zfar\' must be defined.',
            severity: Severity.ERROR,
            pointer: `/cameras/${index}/orthographic`
          });
        } else if (typeof camera.orthographic.zfar === 'number') {
          if (!isFinite(camera.orthographic.zfar) || isNaN(camera.orthographic.zfar)) {
            const valueStr = isNaN(camera.orthographic.zfar) ? 'NaN' : 
                           camera.orthographic.zfar === Infinity ? 'Infinity' : 
                           camera.orthographic.zfar === -Infinity ? '-Infinity' : 
                           camera.orthographic.zfar.toString();
            messages.push({
              code: 'VALUE_NOT_IN_RANGE',
              message: `Value ${valueStr} is out of range.`,
              severity: Severity.ERROR,
              pointer: `/cameras/${index}/orthographic/zfar`
            });
          }
        }

        if (camera.orthographic.znear === undefined) {
          messages.push({
            code: 'UNDEFINED_PROPERTY',
            message: 'Property \'znear\' must be defined.',
            severity: Severity.ERROR,
            pointer: `/cameras/${index}/orthographic`
          });
        } else if (camera.orthographic.znear === null) {
          messages.push({
            code: 'VALUE_NOT_IN_RANGE',
            message: 'Value null is out of range.',
            severity: Severity.ERROR,
            pointer: `/cameras/${index}/orthographic/znear`
          });
        } else if (typeof camera.orthographic.znear === 'number') {
          if (!isFinite(camera.orthographic.znear) || isNaN(camera.orthographic.znear)) {
            const valueStr = isNaN(camera.orthographic.znear) ? 'NaN' : 
                           camera.orthographic.znear === Infinity ? 'Infinity' : 
                           camera.orthographic.znear === -Infinity ? '-Infinity' : 
                           camera.orthographic.znear.toString();
            messages.push({
              code: 'VALUE_NOT_IN_RANGE',
              message: `Value ${valueStr} is out of range.`,
              severity: Severity.ERROR,
              pointer: `/cameras/${index}/orthographic/znear`
            });
          }
        }

        // Check zfar > znear for orthographic cameras
        if (camera.orthographic.zfar !== undefined &&
            camera.orthographic.znear !== undefined &&
            typeof camera.orthographic.zfar === 'number' &&
            typeof camera.orthographic.znear === 'number' &&
            camera.orthographic.zfar <= camera.orthographic.znear) {
          messages.push({
            code: 'CAMERA_ZFAR_LEQUAL_ZNEAR',
            message: 'zfar must be greater than znear.',
            severity: Severity.ERROR,
            pointer: `/cameras/${index}/orthographic`
          });
        }
        
        // Check for unexpected properties in orthographic
        const expectedOrthographicProperties = ['xmag', 'ymag', 'zfar', 'znear', 'extensions', 'extras'];
        for (const key in camera.orthographic) {
          if (!expectedOrthographicProperties.includes(key)) {
            messages.push({
              code: 'UNEXPECTED_PROPERTY',
              message: 'Unexpected property.',
              severity: Severity.WARNING,
              pointer: `/cameras/${index}/orthographic/${key}`
            });
          }
        }
      }
    }

    return messages;
  }
}