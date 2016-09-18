"""Test various error handler functions."""
import pytest

@pytest.mark.options(debug=False)
def test_403(client):
    """Test 403 error."""
    response = client.get('/throwError/403')
    assert response.status_code == 403

@pytest.mark.options(debug=False)
def test_404(client):
    """Test 404 error."""
    response = client.get('/throwError/404')
    assert response.status_code == 404

@pytest.mark.options(debug=False)
def test_500(client):
    """Test 500 error."""
    response = client.get('/throwError/500')
    assert response.status_code == 500
