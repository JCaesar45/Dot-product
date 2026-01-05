def dot_product(vector1, vector2):
    """
    Computes the dot product (scalar product) of two vectors.
    
    Args:
        vector1 (list or tuple): First vector
        vector2 (list or tuple): Second vector
    
    Returns:
        int or float: The dot product of the two vectors
    
    Raises:
        TypeError: If inputs are not lists/tuples or contain non-numeric values
        ValueError: If vectors have different lengths
    """
    # Check if inputs are lists or tuples
    if not isinstance(vector1, (list, tuple)) or not isinstance(vector2, (list, tuple)):
        raise TypeError("Both inputs must be lists or tuples")
    
    # Check if vectors have the same length
    if len(vector1) != len(vector2):
        raise ValueError("Vectors must have the same length")
    
    # Check if all elements are numbers
    for i, (v1, v2) in enumerate(zip(vector1, vector2)):
        if not isinstance(v1, (int, float)) or not isinstance(v2, (int, float)):
            raise TypeError(f"All elements must be numbers. Invalid elements at index {i}: {v1}, {v2}")
    
    # Calculate dot product using list comprehension
    return sum(v1 * v2 for v1, v2 in zip(vector1, vector2))


# Alternative implementation using numpy (if available)
def dot_product_numpy(vector1, vector2):
    """
    Computes the dot product using numpy for better performance.
    
    Args:
        vector1 (list or tuple): First vector
        vector2 (list or tuple): Second vector
    
    Returns:
        int or float: The dot product of the two vectors
    
    Raises:
        ImportError: If numpy is not available
        ValueError: If vectors have different lengths
    """
    try:
        import numpy as np
        
        # Convert to numpy arrays
        v1 = np.array(vector1)
        v2 = np.array(vector2)
        
        # Use numpy's dot function
        return np.dot(v1, v2)
        
    except ImportError:
        # Fallback to pure Python implementation
        return dot_product(vector1, vector2)


# Test function
def test_dot_product():
    """Test function with all provided test cases"""
    test_cases = [
        ([1, 3, -5], [4, -2, -1], 3),
        ([1, 2, 3, 4, 5], [6, 7, 8, 9, 10], 130),
        ([5, 4, 3, 2], [7, 8, 9, 6], 106),
        ([-5, 4, -3, 2], [-7, -8, 9, -6], -36),
        ([17, 27, 34, 43, 15], [62, 73, 48, 95, 110], 10392)
    ]
    
    for i, (v1, v2, expected) in enumerate(test_cases, 1):
        result = dot_product(v1, v2)
        print(f"Test {i}: dot_product({v1}, {v2}) = {result} (Expected: {expected})")
        assert result == expected, f"Test {i} failed: expected {expected}, got {result}"
    
    print("All tests passed!")


if __name__ == "__main__":
    # Run tests
    test_dot_product()
    
    # Example usage
    print("\nExample usage:")
    print(f"dot_product([1, 2, 3], [4, 5, 6]) = {dot_product([1, 2, 3], [4, 5, 6])}")
