const DEFAULT_START_LOCATION_ID = "dorm";

export function buildRouteFromOptions(
  selectedOptions = [],
  { startLocationId = DEFAULT_START_LOCATION_ID, endLocationId = DEFAULT_START_LOCATION_ID } = {}
) {
  const locationIds = [
    startLocationId,
    ...selectedOptions.map((option) => option.locationId).filter(Boolean),
    endLocationId
  ];

  return removeConsecutiveDuplicates(locationIds);
}

export function removeConsecutiveDuplicates(locationIds = []) {
  return locationIds.filter((locationId, index) => {
    return index === 0 || locationId !== locationIds[index - 1];
  });
}

export function hydrateRoute(routeLocationIds = [], locations = []) {
  const locationMap = new Map(locations.map((location) => [location.id, location]));

  return routeLocationIds.map((locationId, index) => ({
    order: index + 1,
    locationId,
    location: locationMap.get(locationId) || null
  }));
}

export function normalizeRouteLocationIds(route = []) {
  return removeConsecutiveDuplicates(
    route
      .map((item) => {
        if (typeof item === "string") return item;
        if (item && typeof item.id === "string") return item.id;
        if (item && typeof item.locationId === "string") return item.locationId;
        return "";
      })
      .filter(Boolean)
  );
}

export function buildGraphFromPaths(paths) {
  const nodes = new Map((paths?.nodes || []).map((node) => [node.id, node]));
  const graph = new Map();

  for (const nodeId of nodes.keys()) {
    graph.set(nodeId, []);
  }

  for (const edge of paths?.edges || []) {
    const fromNode = nodes.get(edge.from);
    const toNode = nodes.get(edge.to);

    if (!fromNode || !toNode) continue;

    const weight = Number.isFinite(edge.weight)
      ? edge.weight
      : getDistance(fromNode, toNode) * getEdgeWeightMultiplier(edge);

    graph.get(edge.from).push({ nodeId: edge.to, weight, type: edge.type || "branch" });
    graph.get(edge.to).push({ nodeId: edge.from, weight, type: edge.type || "branch" });
  }

  return { graph, nodes };
}

export function getAnchorNodeId(locationId, paths) {
  return (paths?.locationAnchors || []).find((anchor) => anchor.locationId === locationId)?.nodeId || null;
}

export function findShortestNodePath(startNodeId, endNodeId, paths) {
  if (!startNodeId || !endNodeId) return [];
  if (startNodeId === endNodeId) return [startNodeId];

  const { graph } = buildGraphFromPaths(paths);
  if (!graph.has(startNodeId) || !graph.has(endNodeId)) return [];

  const distances = new Map();
  const previous = new Map();
  const visited = new Set();
  const queue = new MinPriorityQueue();

  for (const nodeId of graph.keys()) {
    distances.set(nodeId, Infinity);
  }
  distances.set(startNodeId, 0);
  queue.push(startNodeId, 0);

  while (queue.size > 0) {
    const item = queue.pop();
    const currentNodeId = item.nodeId;
    const currentDistance = item.priority;
    if (visited.has(currentNodeId)) continue;
    visited.add(currentNodeId);
    if (currentNodeId === endNodeId) break;

    for (const neighbor of graph.get(currentNodeId) || []) {
      if (visited.has(neighbor.nodeId)) continue;

      const nextDistance = currentDistance + neighbor.weight;
      if (nextDistance < distances.get(neighbor.nodeId)) {
        distances.set(neighbor.nodeId, nextDistance);
        previous.set(neighbor.nodeId, currentNodeId);
        queue.push(neighbor.nodeId, nextDistance);
      }
    }
  }

  if (!previous.has(endNodeId)) return [];

  const path = [endNodeId];
  let cursor = endNodeId;

  while (cursor !== startNodeId) {
    cursor = previous.get(cursor);
    if (!cursor) return [];
    path.unshift(cursor);
  }

  return path;
}

export function buildPathForLocationRoute(routeLocationIds = [], paths) {
  const locationIds = removeConsecutiveDuplicates(routeLocationIds.filter(Boolean));
  const missingAnchors = [];
  const disconnectedSegments = [];
  const nodeIds = [];

  for (let index = 0; index < locationIds.length - 1; index += 1) {
    const fromLocationId = locationIds[index];
    const toLocationId = locationIds[index + 1];
    const fromNodeId = getAnchorNodeId(fromLocationId, paths);
    const toNodeId = getAnchorNodeId(toLocationId, paths);

    if (!fromNodeId || !toNodeId) {
      if (!fromNodeId) missingAnchors.push(fromLocationId);
      if (!toNodeId) missingAnchors.push(toLocationId);
      continue;
    }

    const segment = findShortestNodePath(fromNodeId, toNodeId, paths);
    if (segment.length === 0) {
      disconnectedSegments.push({ fromLocationId, toLocationId });
      continue;
    }

    if (nodeIds.length > 0 && segment[0] === nodeIds[nodeIds.length - 1]) {
      nodeIds.push(...segment.slice(1));
    } else {
      nodeIds.push(...segment);
    }
  }

  const { nodes } = buildGraphFromPaths(paths);

  return {
    locationIds,
    nodeIds,
    nodes: nodeIds.map((nodeId) => nodes.get(nodeId)).filter(Boolean),
    missingAnchors: [...new Set(missingAnchors)],
    disconnectedSegments
  };
}

function getDistance(fromNode, toNode) {
  const dx = Number(fromNode.x) - Number(toNode.x);
  const dy = Number(fromNode.y) - Number(toNode.y);
  return Math.sqrt(dx * dx + dy * dy);
}

function getEdgeWeightMultiplier(edge) {
  if (edge.type === "redline") return 1;
  if (edge.type === "bridge") return 0.85;
  if (edge.type === "access") return 1.35;
  if (edge.type === "branch") return 1.12;
  return 1;
}

class MinPriorityQueue {
  constructor() {
    this.items = [];
  }

  get size() {
    return this.items.length;
  }

  push(nodeId, priority) {
    this.items.push({ nodeId, priority });
    this.bubbleUp(this.items.length - 1);
  }

  pop() {
    const first = this.items[0];
    const last = this.items.pop();

    if (this.items.length > 0) {
      this.items[0] = last;
      this.sinkDown(0);
    }

    return first;
  }

  bubbleUp(index) {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.items[parentIndex].priority <= this.items[index].priority) break;
      [this.items[parentIndex], this.items[index]] = [this.items[index], this.items[parentIndex]];
      index = parentIndex;
    }
  }

  sinkDown(index) {
    while (true) {
      const leftIndex = index * 2 + 1;
      const rightIndex = index * 2 + 2;
      let smallestIndex = index;

      if (
        leftIndex < this.items.length &&
        this.items[leftIndex].priority < this.items[smallestIndex].priority
      ) {
        smallestIndex = leftIndex;
      }

      if (
        rightIndex < this.items.length &&
        this.items[rightIndex].priority < this.items[smallestIndex].priority
      ) {
        smallestIndex = rightIndex;
      }

      if (smallestIndex === index) break;
      [this.items[smallestIndex], this.items[index]] = [this.items[index], this.items[smallestIndex]];
      index = smallestIndex;
    }
  }
}
