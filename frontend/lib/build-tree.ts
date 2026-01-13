export type TreeNode<T> = T & {
  children: TreeNode<T>[];
};

function makeNode<T>(item: T): TreeNode<T> {
  return {
    ...item,
    children: [],
  };
}

export function buildTree<T extends { id: number; path: string }>(
  data: T[],
): TreeNode<T>[] {
  const map = new Map<string, TreeNode<T>>();
  const roots: TreeNode<T>[] = [];
  const nodes = data.map(makeNode);

  // to map efficiently
  nodes.forEach((node) => {
    map.set(node.path, node);
  });

  nodes.forEach((node) => {
    const pathSegments = node.path.split(".");
    // if path has segments
    if (pathSegments.length > 1) {
      const parentPath = pathSegments.slice(0, -1).join(".");
      const parent = map.get(parentPath);

      if (parent) {
        parent.children.push(node);
      } else {
        // fallback
        nodes.push(node);
      }
    } else {
      // if path doesnt have segments
      // i.e: root node
      roots.push(node);
    }
  });

  return roots;
}
