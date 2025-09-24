import { GLTF, GLTFWithExplicitDefinitions, GLTFAsset } from './types';

export class GLTFParser {
  parse(data: Uint8Array): GLTF {
    // Check for BOM at the beginning of JSON file (UTF-8 BOM is EF BB BF)
    if (data.length >= 3 && 
        data[0] === 0xEF && 
        data[1] === 0xBB && 
        data[2] === 0xBF) {
      throw new Error(`Invalid JSON data. Parser output: BOM found at the beginning of UTF-8 stream.`);
    }

    const text = new TextDecoder().decode(data);

    try {
      const json = JSON.parse(text);
      
      // Check if parsed JSON is an object (not array or primitive)
      if (typeof json !== 'object' || json === null || Array.isArray(json)) {
        const typeDescription = Array.isArray(json) ? '[]' : typeof json;
        throw new Error(`TYPE_MISMATCH:Type mismatch. Property value ${typeDescription} is not a 'object'.:`);
      }
      
      return this.validateAndNormalize(json);
    } catch (error) {
      throw new Error(`Failed to parse GLTF JSON: ${error}`);
    }
  }

  private validateAndNormalize(json: unknown): GLTFWithExplicitDefinitions {
    // Basic structure validation - don't throw, let validator handle it
    // if (!json.asset || !json.asset.version) {
    //   throw new Error('GLTF must have an asset object with version');
    // }

    // Normalize arrays to ensure they exist
    const jsonObj = json as Record<string, unknown>;
    const gltf: GLTFWithExplicitDefinitions = {
      asset: jsonObj['asset'] as GLTFAsset,
      ...(jsonObj['scene'] !== undefined && { scene: jsonObj['scene'] as number }),
      scenes: Array.isArray(jsonObj['scenes']) ? jsonObj['scenes'] as GLTF['scenes'] : [],
      nodes: Array.isArray(jsonObj['nodes']) ? jsonObj['nodes'] as GLTF['nodes'] : [],
      materials: Array.isArray(jsonObj['materials']) ? jsonObj['materials'] as GLTF['materials'] : [],
      accessors: Array.isArray(jsonObj['accessors']) ? jsonObj['accessors'] as GLTF['accessors'] : [],
      animations: Array.isArray(jsonObj['animations']) ? jsonObj['animations'] as GLTF['animations'] : [],
      buffers: Array.isArray(jsonObj['buffers']) ? jsonObj['buffers'] as GLTF['buffers'] : [],
      bufferViews: Array.isArray(jsonObj['bufferViews']) ? jsonObj['bufferViews'] as GLTF['bufferViews'] : [],
      cameras: Array.isArray(jsonObj['cameras']) ? jsonObj['cameras'] as GLTF['cameras'] : [],
      images: Array.isArray(jsonObj['images']) ? jsonObj['images'] as GLTF['images'] : [],
      meshes: Array.isArray(jsonObj['meshes']) ? jsonObj['meshes'] as GLTF['meshes'] : [],
      samplers: (jsonObj['samplers'] || []) as GLTF['samplers'],
      skins: Array.isArray(jsonObj['skins']) ? jsonObj['skins'] as GLTF['skins'] : [],
      textures: Array.isArray(jsonObj['textures']) ? jsonObj['textures'] as GLTF['textures'] : [],
      extensions: jsonObj['extensions'] as Record<string, unknown> | undefined,
      extras: jsonObj['extras']
    };

    // Track which properties were explicitly defined in the original JSON
    gltf._explicitlyDefined = {
      scenes: 'scenes' in jsonObj,
      nodes: 'nodes' in jsonObj,
      materials: 'materials' in jsonObj,
      accessors: 'accessors' in jsonObj,
      animations: 'animations' in jsonObj,
      buffers: 'buffers' in jsonObj,
      bufferViews: 'bufferViews' in jsonObj,
      cameras: 'cameras' in jsonObj,
      images: 'images' in jsonObj,
      meshes: 'meshes' in jsonObj,
      samplers: 'samplers' in jsonObj,
      skins: 'skins' in jsonObj,
      textures: 'textures' in jsonObj
    };

    // Copy any additional properties
    for (const key in jsonObj) {
      if (!(key in gltf)) {
        (gltf as Record<string, unknown>)[key] = jsonObj[key];
      }
    }

    return gltf;
  }
}
