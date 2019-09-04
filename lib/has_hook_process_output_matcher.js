function has_hook_process(event) {
    var check_hook_processes = [];
    
    //Here we're checking to see if the event check hooks are not returning null
    
    if (event.hasOwnProperty("check") && event.check.hooks != null) {
        
        check_hook_processes = event.check.hooks.filter(function(entry) { return /\b(\w*gremlin\w*)\b/.test(entry.output); });
  
    }
    
    //
    
    if (check_hook_processes.length >= 1) {
        return true;
    } else {
        return false;
    }
}