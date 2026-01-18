interface ModelConfig {
  path: any;
  scale: number;
  position?: [number, number, number];
}

const categoricalMapping: Record<string, ModelConfig> = {
  cleanser: {
    path: require("../assets/models/spray_bottle.glb"),
    scale: 1.5,
    position: [0, -0.5, 0],
  },
  toner: {
    path: require("../assets/models/cylinder.glb"),
    scale: 2,
  },
  exfoliant: {
    path: require("../assets/models/cylinder.glb"),
    scale: 2,
  },
  serum: {
    path: require("../assets/models/cylinder.glb"),
    scale: 2,
  },
  moisturizer: {
    path: require("../assets/models/cylinder.glb"),
    scale: 2,
  },
  sunscreen: {
    path: require("../assets/models/spray_bottle.glb"),
    scale: 1.5,
    position: [0, -0.5, 0],
  },
  facemasks: {
    path: require("../assets/models/cylinder.glb"),
    scale: 2,
  },
};

export default function getModelConfig(category: string): ModelConfig {
  category = category.toLowerCase().replace(" ", "");
  if (category in categoricalMapping) {
    return categoricalMapping[category];
  }
  console.log("Category not found, defaulting to spray_bottle.glb:", category);
  return {
    path: require("../assets/models/spray_bottle.glb"),
    scale: 1.5,
    position: [0, -0.5, 0],
  };
}
