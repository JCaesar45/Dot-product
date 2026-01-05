function dotProduct(vector1, vector2) {
    // Check if both inputs are arrays
    if (!Array.isArray(vector1) || !Array.isArray(vector2)) {
        throw new Error('Both inputs must be arrays');
    }
    
    // Check if vectors have the same length
    if (vector1.length !== vector2.length) {
        throw new Error('Vectors must have the same length');
    }
    
    // Check if all elements are numbers
    for (let i = 0; i < vector1.length; i++) {
        if (typeof vector1[i] !== 'number' || typeof vector2[i] !== 'number') {
            throw new Error('All elements must be numbers');
        }
    }
    
    // Calculate dot product
    let result = 0;
    for (let i = 0; i < vector1.length; i++) {
        result += vector1[i] * vector2[i];
    }
    
    return result;
}

// Alternative implementation using reduce
function dotProductReduce(vector1, vector2) {
    if (!Array.isArray(vector1) || !Array.isArray(vector2)) {
        throw new Error('Both inputs must be arrays');
    }
    
    if (vector1.length !== vector2.length) {
        throw new Error('Vectors must have the same length');
    }
    
    return vector1.reduce((sum, val, index) => {
        if (typeof val !== 'number' || typeof vector2[index] !== 'number') {
            throw new Error('All elements must be numbers');
        }
        return sum + val * vector2[index];
    }, 0);
}

// Export for Node.js environment
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { dotProduct, dotProductReduce };
}
