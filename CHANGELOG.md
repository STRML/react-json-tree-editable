# Change log

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## 0.12.0

* React >= 16.3 support
  * Refactors use of `componentWillReceiveProps` to `static getDerivedStateFromProps`
* Fix an example bug in `getCollectionEntries` where the sort comparator was set to `false` (should be undefined)
* Minor code style updates