"""
Load app and run it.

Enables debug and profiler.
"""
from flask_debugtoolbar import DebugToolbarExtension
from werkzeug.contrib.profiler import ProfilerMiddleware
from app import runapp

if __name__ == "__main__":
    DebugToolbarExtension(runapp)

    # Enabling profiling
    runapp.config['PROFILE'] = True
    # Get 5 most expensive functions
    runapp.wsgi_app = ProfilerMiddleware(
        runapp.wsgi_app, restrictions=[5]
    )
    runapp.run(debug=True)
