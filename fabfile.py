from fabric.api import env, sudo, run, local, settings
from fabric.context_managers import cd

def deploy():
	local('docpad deploy-ghpages --env static')

def run():
	local('docpad run')