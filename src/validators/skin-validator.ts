import { GLTFSkin, GLTF, ValidationMessage, Severity } from '../types';

export class SkinValidator {
  validate(skin: GLTFSkin, index: number, gltf: GLTF): ValidationMessage[] {
    const messages: ValidationMessage[] = [];

    // Check required joints
    if (!skin.joints || !Array.isArray(skin.joints)) {
      messages.push({
        code: 'UNDEFINED_PROPERTY',
        message: 'Property \'joints\' must be defined.',
        severity: Severity.ERROR,
        pointer: `/skins/${index}`
      });
    } else if (skin.joints.length === 0) {
      messages.push({
        code: 'EMPTY_ENTITY',
        message: 'Entity cannot be empty.',
        severity: Severity.ERROR,
        pointer: `/skins/${index}/joints`
      });
    } else {
      // Validate each joint
      for (let i = 0; i < skin.joints.length; i++) {
        const jointIndex = skin.joints[i];
        if (typeof jointIndex !== 'number' || jointIndex < 0) {
          messages.push({
            code: 'INVALID_VALUE',
            message: 'Skin joint must be a non-negative integer.',
            severity: Severity.ERROR,
            pointer: `/skins/${index}/joints/${i}`
          });
        } else if (!gltf.nodes || jointIndex >= gltf.nodes.length) {
          messages.push({
            code: 'UNRESOLVED_REFERENCE',
            message: 'Unresolved reference: ' + jointIndex + '.',
            severity: Severity.ERROR,
            pointer: `/skins/${index}/joints/${i}`
          });
        }
      }

      // Check if joints have a common root
      if (skin.joints && skin.joints.length > 0) {
        const hasCommonRoot = this.checkCommonRoot(skin.joints, gltf);
        if (!hasCommonRoot) {
          messages.push({
            code: 'SKIN_NO_COMMON_ROOT',
            message: 'Joints do not have a common root.',
            severity: Severity.ERROR,
            pointer: `/skins/${index}/joints`
          });
        }
      }
    }

    // Check inverseBindMatrices
    if (skin.inverseBindMatrices !== undefined) {
      if (typeof skin.inverseBindMatrices !== 'number' || skin.inverseBindMatrices < 0) {
        messages.push({
          code: 'INVALID_VALUE',
          message: 'Skin inverseBindMatrices must be a non-negative integer.',
          severity: Severity.ERROR,
          pointer: `/skins/${index}/inverseBindMatrices`
        });
      } else if (!gltf.accessors || skin.inverseBindMatrices >= gltf.accessors.length) {
        messages.push({
          code: 'UNRESOLVED_REFERENCE',
          message: 'Unresolved reference: ' + skin.inverseBindMatrices + '.',
          severity: Severity.ERROR,
          pointer: `/skins/${index}/inverseBindMatrices`
        });
      } else {
        // Additional IBM accessor validation
        const ibmAccessor = gltf.accessors[skin.inverseBindMatrices];
        if (ibmAccessor) {
          // Check IBM accessor format - must be MAT4, FLOAT
          if (ibmAccessor.type !== 'MAT4' || ibmAccessor.componentType !== 5126) {
            const actualFormat = `{${ibmAccessor.type}, ${this.getComponentTypeName(ibmAccessor.componentType)}}`;
            messages.push({
              code: 'SKIN_IBM_INVALID_FORMAT',
              message: `Invalid IBM accessor format '${actualFormat}'. Must be one of ('{MAT4, FLOAT}').`,
              severity: Severity.ERROR,
              pointer: `/skins/${index}/inverseBindMatrices`
            });
          }

          // Check IBM accessor count matches joints count
          if (skin.joints && skin.joints.length > 0 && ibmAccessor.count < skin.joints.length) {
            messages.push({
              code: 'INVALID_IBM_ACCESSOR_COUNT',
              message: `IBM accessor must have at least ${skin.joints.length} elements. Found ${ibmAccessor.count}.`,
              severity: Severity.ERROR,
              pointer: `/skins/${index}/inverseBindMatrices`
            });
          }

          // Check if IBM accessor's buffer view has byteStride
          if (ibmAccessor.bufferView !== undefined && gltf.bufferViews) {
            const bufferView = gltf.bufferViews[ibmAccessor.bufferView];
            if (bufferView && bufferView.byteStride !== undefined) {
              messages.push({
                code: 'SKIN_IBM_ACCESSOR_WITH_BYTESTRIDE',
                message: 'bufferView.byteStride must not be defined for buffer views used by inverse bind matrices accessors.',
                severity: Severity.ERROR,
                pointer: `/skins/${index}/inverseBindMatrices`
              });
            }
          }

        }
      }
    }

    // Check skeleton
    if (skin.skeleton !== undefined) {
      if (typeof skin.skeleton !== 'number' || skin.skeleton < 0) {
        messages.push({
          code: 'INVALID_VALUE',
          message: 'Skin skeleton must be a non-negative integer.',
          severity: Severity.ERROR,
          pointer: `/skins/${index}/skeleton`
        });
      } else if (!gltf.nodes || skin.skeleton >= gltf.nodes.length) {
        messages.push({
          code: 'UNRESOLVED_REFERENCE',
          message: 'Unresolved reference: ' + skin.skeleton + '.',
          severity: Severity.ERROR,
          pointer: `/skins/${index}/skeleton`
        });
      } else {
        // Check if skeleton is a common root of all joints
        if (skin.joints && skin.joints.length > 0) {
          const isValidSkeleton = this.isSkeletonValidRoot(skin.skeleton, skin.joints, gltf);
          if (!isValidSkeleton) {
            messages.push({
              code: 'SKIN_SKELETON_INVALID',
              message: 'Skeleton node is not a common root.',
              severity: Severity.ERROR,
              pointer: `/skins/${index}/skeleton`
            });
          }
        }
      }
    }

    // Check for unexpected properties
    const expectedProperties = ['inverseBindMatrices', 'skeleton', 'joints', 'name', 'extensions', 'extras'];
    for (const key in skin) {
      if (!expectedProperties.includes(key)) {
        messages.push({
          code: 'UNEXPECTED_PROPERTY',
          message: 'Unexpected property.',
          severity: Severity.WARNING,
          pointer: `/skins/${index}/${key}`
        });
      }
    }

    return messages;
  }

  private checkCommonRoot(joints: number[], gltf: GLTF): boolean {
    if (!gltf.nodes || joints.length === 0) return true;

    // For a single joint, it always has a common root (itself)
    if (joints.length === 1) {
      const jointIndex = joints[0];
      return jointIndex !== undefined && jointIndex >= 0 && jointIndex < gltf.nodes.length;
    }

    // For multiple joints, check if they share a common ancestor
    // Find all ancestors (including self) for each joint
    const allAncestorSets = joints.map(joint => this.getAllAncestors(joint, gltf));
    
    // Find the intersection of all ancestor sets
    if (allAncestorSets.length === 0) return false;
    
    let commonAncestors = new Set(allAncestorSets[0]);
    for (let i = 1; i < allAncestorSets.length; i++) {
      const currentSet = new Set(allAncestorSets[i]);
      commonAncestors = new Set([...commonAncestors].filter(x => currentSet.has(x)));
    }
    
    // If there are any common ancestors, they have a common root
    return commonAncestors.size > 0;
  }

  private isSkeletonValidRoot(skeletonIndex: number, joints: number[], gltf: GLTF): boolean {
    if (!gltf.nodes || joints.length === 0) return false;

    // Basic check: skeleton should be a valid node
    if (skeletonIndex < 0 || skeletonIndex >= gltf.nodes.length) return false;
    
    // For the test case skeleton_invalid.gltf:
    // skeleton=2, joints=[0,1], where node 0 has child 1
    // skeleton 2 is not connected to nodes 0,1 so it's invalid
    
    // Check if skeleton is an ancestor of all joints or is one of the joints
    const isAncestorOfAllJoints = this.checkIfAncestorOfAll(skeletonIndex, joints, gltf);
    const isOneOfJoints = joints.includes(skeletonIndex);
    
    return isAncestorOfAllJoints || isOneOfJoints;
  }

  private checkIfAncestorOfAll(potentialAncestor: number, joints: number[], gltf: GLTF): boolean {
    // Simple check: if the potential ancestor has no connections to the joints,
    // it's not a valid ancestor
    
    // Get all descendants of the potential ancestor
    const descendants = this.getAllDescendants(potentialAncestor, gltf);
    
    // Check if all joints are either descendants or the ancestor itself
    for (const joint of joints) {
      if (joint !== potentialAncestor && !descendants.has(joint)) {
        return false;
      }
    }
    
    return true;
  }

  private getAllDescendants(nodeIndex: number, gltf: GLTF): Set<number> {
    const descendants = new Set<number>();
    const visited = new Set<number>();
    
    const traverse = (index: number) => {
      if (visited.has(index) || !gltf.nodes || index >= gltf.nodes.length) return;
      visited.add(index);
      
      const node = gltf.nodes[index];
      if (node && node.children) {
        for (const childIndex of node.children) {
          if (typeof childIndex === 'number' && childIndex >= 0) {
            descendants.add(childIndex);
            traverse(childIndex);
          }
        }
      }
    };
    
    traverse(nodeIndex);
    return descendants;
  }

  private getAllAncestors(nodeIndex: number, gltf: GLTF): number[] {
    const ancestors: number[] = [];
    const visited = new Set<number>();
    
    // Add the node itself as an ancestor
    ancestors.push(nodeIndex);
    
    // Find all nodes that have this node as a descendant
    if (!gltf.nodes) return ancestors;
    
    const findAncestors = (candidateIndex: number) => {
      if (visited.has(candidateIndex) || candidateIndex >= gltf.nodes!.length) return;
      visited.add(candidateIndex);
      
      const node = gltf.nodes![candidateIndex];
      if (node && node.children) {
        const descendants = this.getAllDescendants(candidateIndex, gltf);
        if (descendants.has(nodeIndex)) {
          ancestors.push(candidateIndex);
        }
      }
    };
    
    // Check all nodes to see which ones are ancestors
    for (let i = 0; i < gltf.nodes.length; i++) {
      if (i !== nodeIndex) {
        findAncestors(i);
      }
    }
    
    return ancestors;
  }


  private getComponentTypeName(componentType: number): string {
    switch (componentType) {
      case 5120: return 'BYTE';
      case 5121: return 'UNSIGNED_BYTE';
      case 5122: return 'SHORT';
      case 5123: return 'UNSIGNED_SHORT';
      case 5125: return 'UNSIGNED_INT';
      case 5126: return 'FLOAT';
      case 5130: return 'DOUBLE';
      default: return 'UNKNOWN';
    }
  }
}
