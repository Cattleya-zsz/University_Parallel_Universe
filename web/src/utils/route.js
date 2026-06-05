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
      : getDistance(fromNode, toNode);

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
  const unvisited = new Set(graph.keys());

  for (const nodeId of graph.keys()) {
    distances.set(nodeId, nodeId === startNodeId ? 0 : Infinity);
  }

  while (unvisited.size > 0) {
    let currentNodeId = null;
    let currentDistance = Infinity;

    for (const nodeId of unvisited) {
      const distance = distances.get(nodeId);
      if (distance < currentDistance) {
        currentDistance = distance;
        currentNodeId = nodeId;
      }
    }

    if (!currentNodeId || currentDistance === Infinity) break;
    if (currentNodeId === endNodeId) break;

    unvisited.delete(currentNodeId);

    for (const neighbor of graph.get(currentNodeId) || []) {
      if (!unvisited.has(neighbor.nodeId)) continue;

      const nextDistance = currentDistance + neighbor.weight;
      if (nextDistance < distances.get(neighbor.nodeId)) {
        distances.set(neighbor.nodeId, nextDistance);
        previous.set(neighbor.nodeId, currentNodeId);
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
