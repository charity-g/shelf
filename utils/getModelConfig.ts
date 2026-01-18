import cream from "../assets/models/cream.json";
import cylinder from "../assets/models/cylinder.json";
import lotion from "../assets/models/lotion.json";
import serum from "../assets/models/serum.json";
import spray from "../assets/models/spray_bottle.json";

interface ModelConfig {
  obj: any;
  scale: number;
  position: [number, number, number];
}

const categoricalMapping: Record<string, ModelConfig> = {
  cleanser: {
    obj: spray,
    scale: 0.8,
    position: [0, 0, 0],
  },
  toner: {
    obj: lotion,
    scale: 0.6,
    position: [0, 0, 0],
  },
  exfoliant: {
    obj: cylinder,
    scale: 0.6,
    position: [0, 0, 0],
  },
  serum: {
    obj: serum,
    scale: 0.6,
    position: [0, 0, 0],
  },
  moisturizer: {
    obj: lotion,
    scale: 0.6,
    position: [0, 0, 0],
  },
  sunscreen: {
    obj: spray,
    scale: 0.8,
    position: [0, 0, 0],
  },
  facemasks: {
    obj: cream,
    scale: 1,
    position: [0, 0, 0],
  },
};

export default function getModelConfig(category: string): ModelConfig {
  category = category.toLowerCase().replace(" ", "");
  if (category in categoricalMapping) {
    return categoricalMapping[category];
  }
  console.log("Category not found, defaulting to spray_bottle.glb:", category);
  return {
    obj: spray,
    scale: 0.7,
    position: [0, 0, 0],
  };
}
