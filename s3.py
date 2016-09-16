"""Upload files to S3 Bucket."""
import os
import boto
import mimetypes
import gzip
import time
import re
from io import BytesIO

# Script uploads static files from a specified folder to a s3 bucket.
# Script will check the last modified date before upload (with server offset).
# The files will be minified if javascript or css.
# Specified files will be gzipped before upload.

#  Original: http://vedovini.net/2010/06/properly-uploading-files-to-amazon-s3/
#        by: Claude Vedovini
# Additions: check ignore file list, check last_modified date
# (with specified server offset)
# TODO: remove files with s3 key, but not in source directory
# (perhaps not delete, but move to "old" directory?).

# Boto picks up configuration from the env.
# Or set it manually in this script
# os.environ['AWS_ACCESS_KEY_ID'] = 'SET YOUR KEY'
# os.environ['AWS_SECRET_ACCESS_KEY'] = 'YOUR SECRET KEY'

# The list of content types to gzip, add more if needed
COMPRESSIBLE = [
    'text/plain',
    'text/csv',
    'application/xml',
    'application/javascript',
    'text/css',
    'image/vnd.microsoft.icon',
    'image/png',
    'image/jpeg',
    'image/gif',
    'application/vnd.ms-fontobject',
    'image/svg+xml',
    'application/font-woff',
    'binary/octet-stream'
]

# List of files to ignore. Currently does not support extensions
IGNORE_FILES = ['.DS_Store']
IGNORE_FOLDERS = ['vendor', 'src']

# Name of local folder
src_folder = 'static'
# Name of bucket on S3. Here same as src_folder
bucket_name = 'static.brmullikin.com'
# Prefix, if any
prefix = ''
# Time offset between your files and server. Here 6 hours
server_offset = (60 * 60 * 6)

# Timestape re rule
SUBSECOND_RE = re.compile('\.[0-9]+')
# Date format
RFC1123 = '%a, %d %b %Y %H:%M:%S %Z'

# Add Less Mimetype
mimetypes.add_type('text/css', '.less')

# convert ISO8601 time to unix timestamp


def iso8601_to_timestamp(iso8601_time):
    """
    Convert iso8601 time to a unix timestamp.

    :param iso8601_time: iso8601_time object or string.
    :return: timestamp
    """
    iso8601_time = SUBSECOND_RE.sub('', iso8601_time)
    try:
        return time.mktime(time.strptime(iso8601_time, boto.utils.ISO8601))
    except ValueError:
        return time.mktime(time.strptime(iso8601_time, RFC1123))


def main():
    """Primary S3 upload function."""
    conn = boto.connect_s3()
    bucket = conn.get_bucket(bucket_name)

    # walk the source directory. Ignore .git and any file in IGNORE
    namelist = []
    for root, dirs, files in os.walk(src_folder):
        dirs[:] = [d for d in dirs if d not in IGNORE_FOLDERS]
        for f in files:
            if f not in IGNORE_FILES:
                path = os.path.relpath(root, src_folder)
                namelist.append(os.path.normpath(os.path.join(path, f)))

    for name in namelist:
        key = bucket.get_key(name)
        if(key):
            full_path = src_folder + "/" + name
            full_path = os.path.abspath(full_path)
            remote = (iso8601_to_timestamp(key.last_modified) - server_offset)
            if (os.stat(full_path).st_mtime > remote):
                stage_file = 'Updating File:'
            else:
                stage_file = False
        else:
            stage_file = "Creating File:"

        if stage_file:
            content = open(os.path.join(src_folder, name))
            key = bucket.new_key(os.path.join(prefix, name))
            type, encoding = mimetypes.guess_type(name)
            type = type or 'application/octet-stream'
            headers = {'Content-Type': type, 'x-amz-acl': 'public-read'}
            states = [type]

            # We only use HTTP 1.1 headers because they are
            # relative to the time of download
            # instead of being hardcoded.
            headers['Cache-Control'] = 'max-age=%d' % (3600 * 24 * 365)

            if type in COMPRESSIBLE:
                headers['Content-Encoding'] = 'gzip'
                compressed = BytesIO()
                gz = gzip.GzipFile(filename=name, fileobj=compressed, mode='w')
                gz.writelines(content)
                gz.close()
                content.close
                content = BytesIO(compressed.getvalue())
                states.append('gzipped')

            states = ', '.join(states)
            print('{} > {} ({})'.format(stage_file, key.name, states))
            key.set_contents_from_file(content, headers)
            content.close()
        else:
            print('Not updated: {}'.format(name))

if __name__ == '__main__':
    main()
