# sensu-go-hook-has-process-filter 
[![Build Status](https://travis-ci.org/asachs01/sensu-go-hook-has-process-filter.svg?branch=master)](https://travis-ci.org/asachs01/sensu-go-hook-has-process-filter)

This project is provides a filter library for evaluating the output of a Sensu [check hook](https://docs.sensu.io/sensu-go/latest/reference/hooks/) that gathers process table information.

## Configuration

Let's start with an example check. In this case, we're checking the CPU of a group of given systems. Of note is the check hook "get_top_processes"

**Example Check**

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

**Example Hook**

Here is the example hook. It just runs a `ps` command and does a bit of sorting by percent of CPU used.

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

**Example Filter**

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
    - has_hook_process(even)
```


