"""Various Config classes for BRMFlask app."""
from brmflask.settings import BaseConfig


class LiveConfig(BaseConfig):
    """Alias the BaseConfig to LiveConfig."""
    pass


class DevConfig(BaseConfig):
    """DevConfig is the default development env."""

    BASE_URI = 'http://'
    ASSET_SUFFIX = ''
    SERVER_NAME = 'brmflask_website.dissata.com:5000'
    HOSTNAME_LIST = [SERVER_NAME]
    ASSET_BASE = 'http://brmflask_website.dissata.com'
    ASSET_PATH = '{}/github/brmullikin/brmflask_boilerplate/static/dist'.format(ASSET_BASE)
    DENY_ROBOTS = True
    FLASK_CACHING = {
        'CACHE_DEFAULT_TIMEOUT': 1,
        'CACHE_TYPE': 'null'
    }
