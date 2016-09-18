"""Initialize flask app for pytest."""
import pytest
from app import runapp
from flask import abort

@runapp.route('/throwError/<int(fixed_digits=3):error>')
def throw_error(error):
    """Add an error routes to test errors."""
    abort(error)

@pytest.fixture
def app():
    """Create testing application."""
    return runapp
