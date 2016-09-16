"""Initiate the brmflask app."""
from brmflask.app import create_app
from flask import render_template

runapp = create_app()


# App-wide Error handlers
@runapp.errorhandler(404)
def page_not_found(e):
    """Page not found. Throw a 404."""
    return render_template('errors/404.html'), 404


@runapp.errorhandler(403)
def internal_server_error(e):
    """User forbidden to access page. Throw a 403."""
    return render_template('errors/403.html'), 403


@runapp.errorhandler(500)
def page_forbidden(e):
    """Server Error. Throw a 500."""
    return render_template('errors/500.html'), 500
