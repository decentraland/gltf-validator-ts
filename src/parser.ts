import { GLTF } from './types';

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

  private validateAndNormalize(json: any): GLTF {
    // Basic structure validation - don't throw, let validator handle it
    // if (!json.asset || !json.asset.version) {
    //   throw new Error('GLTF must have an asset object with version');
    // }

    // Normalize arrays to ensure they exist
    const gltf: GLTF = {
      asset: json.asset,
      scene: json.scene,
      scenes: json.scenes || [],
      nodes: json.nodes || [],
      materials: json.materials || [],
      accessors: json.accessors || [],
      animations: json.animations || [],
      buffers: json.buffers || [],
      bufferViews: json.bufferViews || [],
      cameras: json.cameras || [],
      images: json.images || [],
      meshes: json.meshes || [],
      samplers: json.samplers || [],
      skins: json.skins || [],
      textures: json.textures || [],
      extensions: json.extensions,
      extras: json.extras
    };

    // Track which properties were explicitly defined in the original JSON
    (gltf as any)._explicitlyDefined = {
      scenes: 'scenes' in json,
      nodes: 'nodes' in json,
      materials: 'materials' in json,
      accessors: 'accessors' in json,
      animations: 'animations' in json,
      buffers: 'buffers' in json,
      bufferViews: 'bufferViews' in json,
      cameras: 'cameras' in json,
      images: 'images' in json,
      meshes: 'meshes' in json,
      samplers: 'samplers' in json,
      skins: 'skins' in json,
      textures: 'textures' in json
    };

    // Copy any additional properties
    for (const key in json) {
      if (!(key in gltf)) {
        (gltf as any)[key] = json[key];
      }
    }

    return gltf;
  }
}
