"""OpenAPI/JSON -> internal model."""

from typing import Dict, List, Any


def parse_openapi(raw: Dict[str, Any]) -> List[Dict[str, str]]:
    """
    Minimal parser for OpenAPI specification.
    
    Extracts endpoints (path + method) from OpenAPI paths section.
    
    Args:
        raw: OpenAPI specification as dictionary
        
    Returns:
        List of dictionaries with 'path' and 'method' keys
        
    Example:
        >>> spec = {"paths": {"/ping": {"get": {}}, "/users": {"post": {}, "get": {}}}}
        >>> parse_openapi(spec)
        [{"path": "/ping", "method": "get"}, {"path": "/users", "method": "post"}, {"path": "/users", "method": "get"}]
    """
    endpoints = []
    paths = raw.get("paths", {})
    
    if not isinstance(paths, dict):
        return endpoints
    
    for path, methods in paths.items():
        if not isinstance(methods, dict):
            continue
            
        for method in methods.keys():
            if isinstance(method, str):
                endpoints.append({
                    "path": path,
                    "method": method.lower()
                })
    
    return endpoints

# backward compatibility alias
def load_spec(raw: Dict[str, Any]) -> List[Dict[str, str]]:
    """Alias for parse_openapi — kept for backwards compatibility."""
    return parse_openapi(raw)
