describe("has_hook_process", function() {
    it ("returns false if event does not contain check hooks", function() {
        var event = {check:{hooks:null}}
            
        expect(has_hook_process(event)).toBe(false);
    });
    
    it ("returns true if the event contains check hook output with a string containing gremlin", function() {
        var event = {
            check: {
                hooks: [
                    {
                        output: "USER       PID CMD                                                %CPU\ngremlin   1931 gremlin attack cpu -l 180 -a -p 90                  165\nroot         1 /usr/lib/systemd/systemd --switched-root --system   0.0\nroot         2 [kthreadd]                                          0.0\nroot         3 [ksoftirqd/0]                                       0.0\nroot         5 [kworker/0:0H]                                      0.0\n"
                    }
                ]
            }
        }
        expect(has_hook_process(event)).toBe(true);
    });
});