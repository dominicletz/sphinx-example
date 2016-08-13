This file is included to help prevent hard-to-understand npm errors.

Node 0.12 was the first version of node to natively support Promises which are
required by some packages. One version of Node, 0.11 allowed you to specify a
flag which would also enable Promises but that flag does not make sense for
newer versions of node so it's cleaner to just limit node to be >= 0.12.

To specify a minimum node version we have to specify some properties in the
package.json file. "engines" will specify the minimum node version we support
and "engineStrict" will say we want to error out of npm install if that version
isn't met.

The reason we had to specify this in a separate package.json file is because
node won't actually care if you have "engineStrict" set for your own package
(unless you call npm install from a separate folder which creates its own set
  of problems).
