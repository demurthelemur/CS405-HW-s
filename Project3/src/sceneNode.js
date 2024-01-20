/**
 * @class SceneNode
 * @desc A SceneNode is a node in the scene graph.
 * @property {MeshDrawer} meshDrawer - The MeshDrawer object to draw
 * @property {TRS} trs - The TRS object to transform the MeshDrawer
 * @property {SceneNode} parent - The parent node
 * @property {Array} children - The children nodes
 */

class SceneNode {
  constructor(meshDrawer, trs, parent = null) {
    this.meshDrawer = meshDrawer;
    this.trs = trs;
    this.parent = parent;
    this.children = [];

    if (parent) {
      this.parent.__addChild(this);
    }
  }

  __addChild(node) {
    this.children.push(node);
  }

  draw(mvp, modelView, normalMatrix, modelMatrix) {
    // Calculate the current node's transformation matrix
    var currentTransform = this.trs.getTransformationMatrix();

    // Apply the parent's modelMatrix to the current node's transformation
    var globalTransform = MatrixMult(modelMatrix, currentTransform);

    // Calculate the transformed model, mvp, modelView, and normal matrices for the current node
    var transformedModel = globalTransform;
    var transformedMvp = MatrixMult(mvp, transformedModel);
    var transformedModelView = MatrixMult(modelView, transformedModel);
    var transformedNormals = normalMatrix; // Update this based on your specific requirements and available functions

    // Draw the current node
    this.meshDrawer.draw(
      transformedMvp,
      transformedModelView,
      transformedNormals,
      transformedModel
    );

    // Recursively draw each child node, passing down the current node's globalTransform as their new modelMatrix
    for (var child of this.children) {
      child.draw(mvp, modelView, normalMatrix, globalTransform);
    }
  }
}
