module.exports = function myPlugin({types: t}) {
    return {
        visitor: {
            BinaryExpression(path) {
                if (path.node.operator !== "===") {
                    return;
                }
        
                path.node.left = t.identifier("left");
                path.node.right = t.identifier("right");
            }
        }
    };
}