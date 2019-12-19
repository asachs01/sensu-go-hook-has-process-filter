[![Sensu Bonsai Asset](https://img.shields.io/badge/Bonsai-Download%20Me-brightgreen.svg?colorB=89C967&logo=sensu)](https://bonsai.sensu.io/assets/asachs01/sensu-go-hook-has-process-filter)
[![Build Status](https://travis-ci.org/asachs01/sensu-go-hook-has-process-filter.svg?branch=master)](https://travis-ci.org/asachs01/sensu-go-hook-has-process-filter)

## Sensu Go Hook has Process Filter Plugin

- [Overview](#overview)
- [Files](#files)
- [Usage examples](#usage-examples)
- [Configuration](#configuration)
  - [Sensu Go](#sensu-go)
    - [Asset registration](#asset-registration)
    - [Asset definition](#asset-definition)
    - [Check definition](#check-definition)
    - [Hook definition](#hook-definition)
    - [Event filter definition](#event-filter-definition)
- [Sensu Core](#sensu-core)
- [Installation from source](#installation-from-source)
- [Additional notes](#additional-notes)
- [Contributing](#contributing)

## Overview

This is an experimental project that provides a filter library for evaluating the output of a Sensu [check hook][1] that gathers process table information.

## Files

N/A

## Usage examples

N/A

## Configuration
### Sensu Go
#### Asset registration

Assets are the best way to make use of this plugin. If you're not using an asset, please consider doing so! If you're using sensuctl 5.13 or later, you can use the following command to add the asset: 

`sensuctl asset add asachs01/sensu-go-hook-has-process-filter`

If you're using an earlier version of sensuctl, you can download the asset definition from [this project's Bonsai asset index page][2].

#### Asset definition

```yaml
---
type: Asset
api_version: core/v2
metadata:
  name: sensu-go-hook-has-process-filter
spec:
  url: https://assets.bonsai.sensu.io/1a5f424fe60f0df2f98616ad455e112ea222086f/sensu-go-hook-has-process-filter_0.0.3.tar.gz
  sha512: c05e89d7dee3a139714ad461e64098aa8c1474cb711803f4e06f51b9e4860c3ee0c55e14847503bdb91b24b85db8079025df35587f6b8cb678e14464595e0b42
```

#### Check definition

This example checks the CPU of a group of given systems (note the check hook `get_top_processes`):

```yaml
type: CheckConfig
api_version: core/v2
metadata:
  name: check-cpu
  namespace: default
spec:
  command: sensu-go-cpu-check -w 70 -c 85
  runtime_assets:
  - sensu-go-cpu-check-linux
  interval: 10
  publish: true
  output_metric_format: nagios_perfdata
  output_metric_handlers: ["influxdb"]
  check_hooks:
  - warning:
    - get_top_processes
  - critical:
    - get_top_processes
  handlers:
  - slack
  subscriptions:
  - system
```

#### Hook definition

This example hook runs a `ps` command and does a bit of sorting by percent of CPU used:

```yaml
type: HookConfig
api_version: core/v2
metadata:
  annotations: null
  labels: null
  name: get_top_processes
  namespace: default
spec:
  command: |-
    ps -eo user,pid,cmd:50,%cpu --sort=-%cpu | head -n 6
  stdin: false
  timeout: 60
```

#### Event filter definition

```yaml
---
type: EventFilter
api_version: core/v2
metadata:
  name: hook_process_gremlin
  namespace: default
spec:
  action: allow
  runtime_assets:
    - sensu-go-hook-has-process-filter
  expressions:
    - has_hook_process(event)
```

### Sensu Core

N/A

## Installation from source

### Sensu Go

See the instructions above for [asset registration](#asset-registration).

### Sensu Core

Install and setup plugins on [Sensu Core](https://docs.sensu.io/sensu-core/latest/installation/installing-plugins/).

## Additional notes

N/A

## Contributing

See the [Sensu Go repository CONTRIBUTING.md][3] for information about contributing to this plugin. 

[1]: https://docs.sensu.io/sensu-go/latest/reference/hooks/
[2]: https://bonsai.sensu.io/assets/asachs01/sensu-go-hook-has-process-filter
[3]: https://github.com/sensu/sensu-go/blob/master/CONTRIBUTING.md
