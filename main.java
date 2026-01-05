/**
 * Utility class for vector operations
 */
public class VectorOperations {
    
    /**
     * Computes the dot product (scalar product) of two vectors
     * @param vector1 First vector
     * @param vector2 Second vector
     * @return The dot product of the two vectors
     * @throws IllegalArgumentException if vectors have different lengths or null inputs
     */
    public static double dotProduct(double[] vector1, double[] vector2) {
        // Check for null inputs
        if (vector1 == null || vector2 == null) {
            throw new IllegalArgumentException("Vectors cannot be null");
        }
        
        // Check if vectors have the same length
        if (vector1.length != vector2.length) {
            throw new IllegalArgumentException("Vectors must have the same length");
        }
        
        // Calculate dot product
        double result = 0.0;
        for (int i = 0; i < vector1.length; i++) {
            result += vector1[i] * vector2[i];
        }
        
        return result;
    }
    
    /**
     * Overloaded method for integer vectors
     * @param vector1 First vector
     * @param vector2 Second vector
     * @return The dot product of the two vectors
     * @throws IllegalArgumentException if vectors have different lengths or null inputs
     */
    public static int dotProduct(int[] vector1, int[] vector2) {
        // Check for null inputs
        if (vector1 == null || vector2 == null) {
            throw new IllegalArgumentException("Vectors cannot be null");
        }
        
        // Check if vectors have the same length
        if (vector1.length != vector2.length) {
            throw new IllegalArgumentException("Vectors must have the same length");
        }
        
        // Calculate dot product
        int result = 0;
        for (int i = 0; i < vector1.length; i++) {
            result += vector1[i] * vector2[i];
        }
        
        return result;
    }
    
    // Test method
    public static void main(String[] args) {
        // Test cases
        int[] v1 = {1, 3, -5};
        int[] v2 = {4, -2, -1};
        System.out.println("dotProduct([1, 3, -5], [4, -2, -1]) = " + dotProduct(v1, v2)); // Should print 3
        
        int[] v3 = {1, 2, 3, 4, 5};
        int[] v4 = {6, 7, 8, 9, 10};
        System.out.println("dotProduct([1, 2, 3, 4, 5], [6, 7, 8, 9, 10]) = " + dotProduct(v3, v4)); // Should print 130
    }
}
