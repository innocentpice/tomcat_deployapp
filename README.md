# -- TOMCAT DEPLOYMENT -
this is tools for deploy app to tomcat server with .sh
#### HOW TO CONFIG
-- @config.json
```
{
    "profileSelect": "dev_local", /* SELECT PROFILE IS YOUR SETTING */
	"contextName": "grirbpm", /* CONTEXTNAME (it same your .war name) */
	"folder": "D:\\teamprojects\\simpleBPM1\\target\\", /* path to your .war */
	"runningMode": "multiple", /* mode for running your tasks at mutiport deploy [ "queue" OR "multiple" ] */
	"profiles": { 
	    "profile_name": { /* your profile setting */
		    "login": "your user name",
			"password": "your password",
			"hostname": "your host",
			"path": "/manager",
			"ports": ["your port as arr[string]"]
		},
		"dev_local": {
			"login": "root",
			"password": "root",
			"hostname": "localhost",
			"path": "/manager",
			"ports": ["8080", "8081", "8082", "8083", "8084"]
		}
	}
}
```
